# Usa una imagen oficial de Python
FROM python:3.9

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del backend
COPY . .

# ✅ Instala netcat para usar el comando `nc`
RUN apt-get update && apt-get install -y netcat-openbsd


# Da permisos al script si vas a usarlo (opcional si volvés a usar wait-for-db.sh)
# RUN chmod +x wait-for-db.sh

# Instala las dependencias de Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app.wsgi"]
