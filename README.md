# CDR
- Cliente: Axel & David (Izkara)
- Servidor: Víctor & David (Cerezo)

# Fases

## Primera Fase: Cliente

- Implementar un programa en Python que envíe un UID ficticio al servidor a través de una solicitud HTTP GET.
- Manejar la respuesta del servidor para confirmar que se ha enviado el UID.

### Servidor

- Configurar un servidor Node.js que pueda recibir solicitudes HTTP GET.
- Procesar la solicitud recibida y enviar una respuesta al cliente.

### Sugerencias

- Usa un UID ficticio para simular la lectura de la tarjeta NFC y la comunicación con el servidor en el cliente.
- Implementa una ruta en el servidor Node.js para manejar las solicitudes GET y enviar una respuesta de confirmación.

## Segunda Fase: Cliente

- Implementar la lectura real del UID de la tarjeta NFC.
- Enviar el UID leído al servidor a través de una solicitud HTTP GET.
- Manejar la respuesta del servidor de manera adecuada en el cliente.

### Servidor

- Procesar la solicitud recibida, validar el UID en la base de datos y enviar una respuesta con datos aleatorios al cliente.

### Sugerencias

- Utiliza un lector NFC real o un módulo compatible para leer el UID de la tarjeta en el cliente.
- En el servidor, conecta la base de datos MySQL y verifica si el UID existe en la tabla de estudiantes.

## Tercera Fase: Cliente

- Diseñar una interfaz gráfica que permita al usuario introducir la tarjeta NFC.
- Mostrar el nombre del estudiante en la interfaz gráfica cuando se autentica.

### Servidor

- Establecer una comunicación con la base de datos MySQL para realizar consultas según la solicitud del cliente.
- Responder al cliente con los datos solicitados.

### Sugerencias

- Utiliza herramientas como Gtk (PyGTK) para crear una interfaz gráfica amigable en el cliente.
- En el servidor, define rutas para manejar consultas a las tablas de tareas, horarios y notas en la base de datos.

## Cuarta Fase: Cliente

- Permitir que el usuario envíe comandos al servidor.
- Procesar y mostrar los datos en la interfaz gráfica, si es posible.

### Servidor

- Interpretar y procesar los comandos enviados por el cliente.
- Responder al cliente con los datos necesarios según los comandos.

### Sugerencias

- Define una estructura clara para los comandos que el cliente puede enviar al servidor, y cómo se deben procesar.

## Quinta Fase: Cliente

- Realizar pruebas exhaustivas en cada fase del proyecto.
- Mejorar los estilos CSS y la interfaz gráfica.

### Servidor

- Realizar pruebas de funcionamiento y rendimiento en el servidor.
- Asegurarse de que todas las rutas y consultas en la base de datos funcionen correctamente.

### Sugerencias

- Documenta y comenta tu código de manera adecuada en cada fase para facilitar futuras revisiones y colaboraciones.
- Mejora los estilos CSS para hacer que la aplicación sea más atractiva y fácil de usar.

