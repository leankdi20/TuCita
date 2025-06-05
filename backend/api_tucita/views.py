from rest_framework import viewsets
from .models import Paciente, Profesional, Cita, Diagnostico, Archivo
from .serializers import PacienteSerializer, ProfesionalSerializer, CitaSerializer, DiagnosticoSerializer, ArchivoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication



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


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related('paciente', 'profesional').all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        profesional = Profesional.objects.get(usuario=self.request.user)
        serializer.save(profesional=profesional)

    
        
        


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
