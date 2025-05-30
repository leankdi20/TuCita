# Usa una imagen oficial de Python
FROM python:3.9

# Establece el directorio de trabajo
WORKDIR /app

# Instala dependencias del sistema necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
    
# Copia requirements primero para aprovechar la cache
COPY requirements.txt requirements.txt

# Instala dependencias de Python antes de copiar todo el código
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# Copia los archivos del backend
COPY . .

# ✅ Instala netcat para usar el comando `nc`
RUN apt-get update && apt-get install -y netcat-openbsd


EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app.wsgi"]
