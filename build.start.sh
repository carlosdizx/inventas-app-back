#!/bin/bash

echo "Iniciando el proceso de compilación..."

echo "Deteniendo aplicaciones gestionadas por PM2..."
pm2 kill

echo "Eliminando el directorio dist existente..."
rm -f -r dist

echo "Construyendo el proyecto..."
npm run build

echo "Copiando archivos de public a dist..."
cp -r public dist

echo "Iniciando la aplicación..."
npm start

echo "Despliegue completado."
