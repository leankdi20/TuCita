from rest_framework import serializers
from .models import Paciente, Profesional, Cita, Diagnostico, Archivo, Usuario
from core.serializers import UsuarioSerializer


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class ProfesionalCreateSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())

    class Meta:
        model = Profesional
        fields = ['usuario', 'telefono', 'foto']

class ProfesionalSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = Profesional
        fields = ['id','usuario', 'telefono', 'foto']

class CitaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer()
    profesional = ProfesionalSerializer()

    class Meta:
        model = Cita
        fields = '__all__'

class CitaCreateSerializer(serializers.ModelSerializer):
    paciente = serializers.PrimaryKeyRelatedField(queryset=Paciente.objects.all())
    profesional = serializers.PrimaryKeyRelatedField(queryset=Profesional.objects.all())

    class Meta:
        model = Cita
        fields = '__all__'

class DiagnosticoSerializer(serializers.ModelSerializer):
    cita = CitaSerializer()

    class Meta:
        model = Diagnostico
        fields = '__all__'
        
class ArchivoSerializer(serializers.ModelSerializer):
    diagnostico = DiagnosticoSerializer()

    class Meta:
        model = Archivo
        fields = '__all__'

