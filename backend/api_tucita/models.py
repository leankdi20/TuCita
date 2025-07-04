from django.db import models
from django.contrib.auth.models import AbstractUser
from core.models import Usuario


# Create your models here.


class Paciente(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    edad = models.IntegerField()
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15, unique=True)
    cedula = models.CharField(max_length=20, unique=True)
    alergias = models.TextField(blank=True, null=True)
    enfermedades_previas = models.TextField(blank=True, null=True)
    observaciones_clinicas = models.TextField(blank=True, null=True)
    estado_paciente = models.CharField(
        max_length=20, 
        choices=[
            ('activo', 'Activo'),
            ('inactivo', 'Inactivo'),
            ('pendiente', 'Pendiente')
        ], 
        default='activo'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    


class Profesional(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=15, unique=True , null=True, blank=True)
    foto = models.ImageField(upload_to='fotos_profesionales/', blank=True, null=True)
    Profesional = models.CharField(max_length=50, blank=True, null=True, default="Profesional de salud")
    edad = models.IntegerField(max_length=3,blank=True, null=True, default= 0 )
    precio = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default= 0 )
    ganancias = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default= 0 )
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    def __str__(self):
        return f"{self.usuario.nombre} {self.usuario.apellido}"
    
# arriba del modelo
ESTADO_CHOICES = [
    ('pendiente', 'Pendiente'),
    ('confirmada', 'Confirmada'),
    ('cancelada', 'Cancelada'),
    ('no_asistida', 'No asistida'),
    ('completada', 'Completada')
]

MOTIVOS_CONSULTA = [
        ('Caries', 'Caries'),
        ('Consulta general', 'Consulta general'),
        ('Limpieza dental', 'Limpieza dental'),
        ('Endodoncia', 'Endodoncia'),
        ('Extracción dental', 'Extracción dental'),
        ('Atención de urgencia', 'Atención de urgencia'),
        ('Blanqueamiento dental', 'Blanqueamiento dental'),
        ('Ortodoncia', 'Ortodoncia'),
        ('Prótesis dental', 'Prótesis dental'),
        ('Consulta por dolor', 'Consulta por dolor'),
        ('Control de tratamiento', 'Control de tratamiento'),
        ('Consulta pediátrica', 'Consulta pediátrica'),
        ('Consulta estética', 'Consulta estética'),
    ]

    
class Cita(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE ,related_name="citas")
    profesional = models.ForeignKey(Profesional, on_delete=models.CASCADE, related_name="citas")
    fecha = models.DateTimeField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    motivo_consulta = models.CharField(max_length=50, choices=MOTIVOS_CONSULTA)
    observaciones = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    diagnostico = models.TextField(blank=True, null=True)
    tratamiento_recomendado = models.TextField(blank=True, null=True)
    enviar_recordatorio = models.BooleanField(default=False)

    def __str__(self):
        return f"Cita de {self.paciente} con {self.profesional} el {self.fecha.strftime('%d-%m-%Y')}"
    
    
class Archivo(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='archivos')
    nombre = models.CharField(max_length=255, blank=True, null=True)  # opcional, para mostrar nombre personalizado
    archivo_adjunto = models.FileField(upload_to='archivos_pacientes/', blank=True, null=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)  # opcional, útil para orden
    descripcion = models.TextField(blank=True, null=True)  # opcional, para agregar contexto

    def __str__(self):
        return f"Archivo de {self.paciente.nombre} {self.paciente.apellido} ({self.id})"