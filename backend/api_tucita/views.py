from rest_framework import viewsets
from .models import Paciente, Profesional, Cita, Diagnostico, Archivo
from .serializers import PacienteSerializer, ProfesionalSerializer,ProfesionalCreateSerializer, CitaSerializer,CitaCreateSerializer, DiagnosticoSerializer, ArchivoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from .filters import CitaFilter



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


    
        
        


class DiagnosticoViewSet(viewsets.ModelViewSet):
    queryset = Diagnostico.objects.select_related('cita').all()
    serializer_class = DiagnosticoSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

class ArchivoViewSet(viewsets.ModelViewSet):
    queryset = Archivo.objects.select_related('diagnostico').all()
    serializer_class = ArchivoSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
