#!/bin/bash

echo "Iniciando proceso de deploy a AWS Lambda"

npx serverless deploy --aws-profile personal --stage develop

echo "Despliegue completado."
