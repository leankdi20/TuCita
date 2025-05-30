from rest_framework import serializers
from .models import Paciente, Profesional, Cita, Diagnostico
from core.serializers import UsuarioSerializer


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class ProfesionalSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = Profesional
        fields = ['id', 'usuario', 'telefono', 'foto']

class CitaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer()
    profesional = ProfesionalSerializer()

    class Meta:
        model = Cita
        fields = '__all__'

class DiagnosticoSerializer(serializers.ModelSerializer):
    cita = CitaSerializer()

    class Meta:
        model = Diagnostico
        fields = '__all__'

