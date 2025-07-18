import requests
from core.models import Usuario
from api_tucita.models import Profesional, Paciente, Cita,Archivo
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
        usuario = Usuario.objects.get(id=2)

        # Paso 2: Crear profesional (si no existe)
        profesional, creado = Profesional.objects.get_or_create(
            usuario=usuario,
            defaults={'telefono': '86304521'}
        )

        # Paso 3: Crear paciente
        paciente = Paciente.objects.create(
            nombre='Maria  ',
            apellido='Llamas',
            edad=34,
            correo='maria.llamas@example.com',
            telefono='6665874',
            cedula='11474422',
            alergias='Amoxicilina',
            enfermedades_previas='Diabetes',
            observaciones_clinicas='Padecientes de diabetes.'
        )

        # Paso 4: Crear cita
        cita = Cita.objects.create(
            paciente=paciente,
            profesional=profesional,
            fecha=timezone.now(),
            hora_inicio=time(10, 0),
            hora_fin=time(10, 30),
            motivo_consulta='Extracción de molar',
            observaciones='Extracción en pieza 12.',
            estado='confirmada',
            enviar_recordatorio=True
        )



        print("✅ Datos agregados correctamente.")

    except Usuario.DoesNotExist:
        print("❌ Usuario con ID 2 no encontrado.")
    except Exception as e:
        print(f"⚠️ Error: {e}")