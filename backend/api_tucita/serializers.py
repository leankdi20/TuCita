from rest_framework import serializers
from .models import Paciente, Profesional, Cita, Archivo, Usuario
from core.serializers import UsuarioSerializer


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class ProfesionalCreateSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())

    class Meta:
        model = Profesional
        fields = ['usuario', 'telefono', 'foto', 'Profesional','precio','ganancias', 'edad', 'ciudad']

class ProfesionalSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = Profesional
        fields = ['id','usuario', 'telefono', 'foto', 'Profesional','precio','ganancias', 'edad', 'ciudad']


MOTIVOS_VALIDOS = [
    'Caries',
    'Consulta general',
    'Limpieza dental',
    'Endodoncia',
    'Extracción dental',
    'Atención de urgencia',
    'Blanqueamiento dental',
    'Ortodoncia',
    'Prótesis dental',
    'Consulta por dolor',
    'Control de tratamiento',
    'Consulta pediátrica',
    'Consulta estética',
]


class CitaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer()
    profesional = ProfesionalSerializer()

    class Meta:
        model = Cita
        fields = '__all__'

    def validate_motivo_consulta(self, value):
        if value not in MOTIVOS_VALIDOS:
            raise serializers.ValidationError(f"Motivo de consulta inválido. Opciones válidas: {', '.join(MOTIVOS_VALIDOS)}")
        return value

class CitaCreateSerializer(serializers.ModelSerializer):
    paciente = serializers.PrimaryKeyRelatedField(queryset=Paciente.objects.all())
    profesional = serializers.PrimaryKeyRelatedField(queryset=Profesional.objects.all())

    class Meta:
        model = Cita
        fields = '__all__'



class ArchivoSerializer(serializers.ModelSerializer):
    paciente = serializers.PrimaryKeyRelatedField(queryset=Paciente.objects.all())

    class Meta:
        model = Archivo
        fields = '__all__'

    def validate_archivo_adjunto(self, value):
        if value in [None, '', 'null']:
            return None
        return value

