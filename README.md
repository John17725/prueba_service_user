# Proyecto Node.js con Docker

Este proyecto está configurado para utilizar Docker y Node.js. A continuación se detallan los pasos para levantar el proyecto y ejecutar las pruebas.

## Requisitos

- Docker
- Node.js 20.17.0

## Levantar el Proyecto

Para levantar el proyecto, utiliza el siguiente comando:

```bash
docker compose up --build -d
```
Este comando construirá las imágenes necesarias y levantará los contenedores en segundo plano.

## Ejecutar Test
Para ejecutar las pruebas del proyecto, utiliza el siguiente comando:

```bash
npm run test
```
Nota
Asegúrate de tener Node.js 20.17.0 instalado en tu entorno local para evitar problemas de compatibilidad.
