# Usar una imagen oficial de Node
FROM node:18

# Crear el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto en que Vite corre por defecto
EXPOSE 5173

# Comando para iniciar Vite en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
