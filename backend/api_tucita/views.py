from rest_framework import viewsets
from .models import Paciente, Profesional, Cita, Diagnostico
from .serializers import PacienteSerializer, ProfesionalSerializer, CitaSerializer, DiagnosticoSerializer
from rest_framework.permissions import IsAuthenticated


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]


class ProfesionalViewSet(viewsets.ModelViewSet):
    queryset = Profesional.objects.select_related('usuario').all()
    serializer_class = ProfesionalSerializer
    permission_classes = [IsAuthenticated]


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.select_related('paciente', 'profesional').all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]


class DiagnosticoViewSet(viewsets.ModelViewSet):
    queryset = Diagnostico.objects.select_related('cita').all()
    serializer_class = DiagnosticoSerializer
    permission_classes = [IsAuthenticated]