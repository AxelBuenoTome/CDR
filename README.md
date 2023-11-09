## Resumen de la Fase 1 (conexión cliente-servidor/envío UID/respuesta)

### Configuración de un Servidor Node.js en Raspberry Pi

- Instalamos nodejm con el comando (`sudo apt install nodejs npm`)
- Verificamos que esté bien instalado con (`node -v`) y con (`npm -v`)
- Creamos un directorio para trabajar
- Iniciamos (`npm init`) y seguimos con la configuración predeterminada del proyecto
- Instalamos express con (`npm install express --save`)
- Configuramos un servidor [NodeUID.js](https://github.com/AxelBuenoTome/CDR/blob/Pruebas/NodeUID.js) en la Raspberry Pi.

### Desarrollo de un Cliente en Python

- Instalamos la l ibrería requests con el comando (`pip install requests`)
- Creamos un cliente en Python [clienteUID.py](https://github.com/AxelBuenoTome/CDR/blob/Pruebas/clienteUID.py) para interactuar con el servidor Node.js.

### Verificación de Conexión al Servidor

- Ejecutamos el NodeUID.js en el terminal con el comando (`node NodeUID.js`)
- Verificamos que el servidor Node.js y el cliente Python puedan comunicarse con éxito.
- Se aseguró la conectividad a través de la red local.

### Problemas Actuales

- Dificultades al acceder desde el dispositivo móvil conectado a la misma red
