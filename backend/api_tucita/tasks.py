import requests
from core.models import Usuario
from api_tucita.models import Profesional, Paciente, Cita, Diagnostico, Archivo
from django.utils import timezone
from datetime import time



def get_usuarios():
    """
    Función para obtener los usuarios desde el endpoint de la API.
    """
    url = 'http://localhost:8000/api/profesionales/'
    headers = {
        'Authorization': 'Token 572a419690e16738b6b2fc2a4b30a52aed2ae895'
    }

    response = requests.get(url, headers=headers)

    print(response.status_code)
    print(response.json())
#Necesito recorrer este endpoint y obtener los datos de cada uno de los usuarios
# url = "http://localhost:8000/api/usuarios/"
# response = requests.get(url)
# if response.status_code == 200:
#     usuarios = response.json()
#     for usuario in usuarios:
#         print(f"ID: {usuario['id']}, Nombre: {usuario['nombre']}, Email: {usuario['email']}")
def agregar_dato():
    try:
        # Paso 1: Obtener el usuario
        usuario = Usuario.objects.get(id=1)

        # Paso 2: Crear profesional (si no existe)
        profesional, creado = Profesional.objects.get_or_create(
            usuario=usuario,
            defaults={'telefono': '86304521'}
        )

        # Paso 3: Crear paciente
        paciente = Paciente.objects.create(
            nombre='Ana',
            apellido='López',
            edad=30,
            correo='ana.lopez@example.com',
            telefono='88776655',
            cedula='123456789',
            alergias='Penicilina',
            enfermedades_previas='Asma',
            observaciones_clinicas='Paciente con historial de crisis asmáticas.'
        )

        # Paso 4: Crear cita
        cita = Cita.objects.create(
            paciente=paciente,
            profesional=profesional,
            fecha=timezone.now(),
            hora_inicio=time(9, 0),
            hora_fin=time(9, 30),
            motivo_consulta='Dolor en muela',
            observaciones='Requiere evaluación de endodoncia.',
            estado='confirmada',
            enviar_recordatorio=True
        )

        # Paso 5: Crear diagnóstico
        diagnostico = Diagnostico.objects.create(
            cita=cita,
            descripcion='Caries profunda en molar inferior derecho.',
            tratamiento_recomendado='Realizar endodoncia y colocar corona.'
        )

        # Paso 6: Asociar archivo (mock - solo ruta, sin archivo real)
        Archivo.objects.create(
            diagnostico=diagnostico,
            archivo_adjunto='archivos_diagnosticos/muela.jpeg'  # asegúrate que este archivo exista si lo necesitás
        )

        print("✅ Datos agregados correctamente.")

    except Usuario.DoesNotExist:
        print("❌ Usuario con ID 1 no encontrado.")
    except Exception as e:
        print(f"⚠️ Error: {e}")