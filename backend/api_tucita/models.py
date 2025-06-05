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

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    


class Profesional(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=15, unique=True , null=True, blank=True)
    foto = models.ImageField(upload_to='fotos_profesionales/', blank=True, null=True)

    def __str__(self):
        return f"{self.usuario.nombre} {self.usuario.apellido}"
    
class Cita(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE ,related_name="citas")
    profesional = models.ForeignKey(Profesional, on_delete=models.CASCADE, related_name="citas")
    fecha = models.DateTimeField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    motivo_consulta = models.TextField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('no_asistida', 'No asistida'),
        ('completada', 'Completada')
    ], default='pendiente')
    enviar_recordatorio = models.BooleanField(default=False)

    def __str__(self):
        return f"Cita de {self.paciente} con {self.profesional} el {self.fecha.strftime('%d-%m-%Y')}"
    
class Diagnostico(models.Model):
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE)
    descripcion = models.TextField()
    tratamiento_recomendado = models.TextField(blank=True, null=True)
    fecha_diagnostico = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Diagnóstico para {self.cita.paciente} en {self.cita.fecha.strftime('%d-%m-%Y')}"
    
class Archivo(models.Model):
    diagnostico = models.ForeignKey(Diagnostico, on_delete=models.CASCADE, related_name='archivos')
    archivo_adjunto = models.FileField(
        upload_to='archivos_diagnosticos/', 
        blank=True, 
        null=True
    )

    def __str__(self):
        return f"Archivo para diagnóstico {self.diagnostico.id}"