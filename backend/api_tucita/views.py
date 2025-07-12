from rest_framework import viewsets
from .models import Paciente, Profesional, Cita, Archivo
from .serializers import PacienteSerializer, ProfesionalSerializer,ProfesionalCreateSerializer, CitaSerializer,CitaCreateSerializer, ArchivoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser
from .filters import CitaFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.timezone import now
from datetime import timedelta
from django.db.models import Count
from rest_framework.decorators import api_view
from api_tucita.models import Cita, Paciente



class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    


class ProfesionalViewSet(viewsets.ModelViewSet):
    queryset = Profesional.objects.select_related('usuario').all()
    serializer_class = ProfesionalSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProfesionalCreateSerializer
        return ProfesionalSerializer
    
    def get_queryset(self):
        queryset = Profesional.objects.select_related('usuario').all()
        usuario_id = self.request.query_params.get('usuario_id')
        if usuario_id:
            queryset = queryset.filter(usuario_id=usuario_id)
        return queryset



class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related('paciente', 'profesional').all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CitaFilter 
    

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CitaCreateSerializer  # En POST usás solo IDs
        return CitaSerializer  

    def get_queryset(self):
        queryset = Cita.objects.all()
        paciente_id = self.request.query_params.get('paciente')
        cita_id = self.request.query_params.get('id')
        if cita_id:
            queryset = queryset.filter(id=cita_id)
        if paciente_id:
            queryset = queryset.filter(paciente_id=paciente_id)
        return queryset



class ArchivoViewSet(viewsets.ModelViewSet):
    queryset = Archivo.objects.select_related('paciente').all()
    serializer_class = ArchivoSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    parser_classes = [MultiPartParser, FormParser] 

    def get_queryset(self):
        queryset = Archivo.objects.all()
        paciente_id = self.request.query_params.get('paciente')
        if paciente_id:
            queryset = queryset.filter(paciente_id=paciente_id)
        return queryset
    

class GraficoAtencionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hoy = now().date()
        primer_dia_mes_actual = hoy.replace(day=1)
        primer_dia_mes_anterior = (primer_dia_mes_actual - timedelta(days=1)).replace(day=1)
        ultimo_dia_mes_anterior = primer_dia_mes_actual - timedelta(days=1)

        # Citas agrupadas por motivo para cada mes
        citas_mes_actual = Cita.objects.filter(
            fecha__gte=primer_dia_mes_actual,
            fecha__lte=hoy
        ).values('motivo_consulta').annotate(count=Count('id'))

        citas_mes_anterior = Cita.objects.filter(
            fecha__gte=primer_dia_mes_anterior,
            fecha__lte=ultimo_dia_mes_anterior
        ).values('motivo_consulta').annotate(count=Count('id'))

        # Convertimos a diccionarios: {motivo: cantidad}
        actual_dict = {item['motivo_consulta']: item['count'] for item in citas_mes_actual}
        anterior_dict = {item['motivo_consulta']: item['count'] for item in citas_mes_anterior}

        # Todos los motivos disponibles (aunque no tengan citas)
        motivos = [m[0] for m in Cita._meta.get_field('motivo_consulta').choices]

        colores = [
            "#0b3f1c", "#15803d", "#4ade80", "#86efac", "#22c55e", "#16a34a", "#14532d",
            "#b6eada", "#49ce94", "#84cc16", "#22c55e", "#7dd3fc", "#60a5fa", "#4f46e5"
        ]

        data = []

        for i, motivo in enumerate(motivos):
            actual = actual_dict.get(motivo, 0)
            anterior = anterior_dict.get(motivo, 0)
            total = actual + anterior
            porcentaje = f"{round((actual / total) * 100)}%" if total > 0 else "0%"

            data.append({
                "diagnostico": motivo,
                "mesActual": actual,
                "mesAnterior": anterior,
                "porcentaje": porcentaje,
                "color": colores[i % len(colores)]
            })

        return Response(data)
    



@api_view(['GET'])
def ultimos_pacientes_atendidos(request):
    citas = Cita.objects.select_related('paciente').order_by('-fecha')[:5]
    data = [
        {
            "paciente_nombre": f"{cita.paciente.nombre} {cita.paciente.apellido}",
            "fecha": cita.fecha.strftime('%d-%m-%Y'),
            "motivo_consulta": cita.motivo_consulta
        }
        for cita in citas
    ]
    return Response(data)


@api_view(['GET'])
def indicadores_pacientes(request):
    hoy = now().date()
    mes_actual = hoy.month
    anio_actual = hoy.year

    # Pacientes activos: todos los pacientes
    total_pacientes = Paciente.objects.count()

    # Nuevos pacientes este mes
    nuevos_pacientes = Paciente.objects.filter(
        fecha_creacion__month=mes_actual,
        fecha_creacion__year=anio_actual
    ).count()

    # Citas de seguimiento (pendientes)
    citas_pendientes = Cita.objects.filter(estado='pendiente').count()

    return Response({
        "activos": total_pacientes,
        "nuevos_mes": nuevos_pacientes,
        "citas_pendientes": citas_pendientes
    })