# NFC Card Reader - Cliente

Este es el cliente de un sistema de lectura de tarjetas NFC que se comunica con un servidor para identificar a los usuarios a partir de sus tarjetas NFC.

## Funcionalidad Actual

- La aplicación presenta una interfaz gráfica utilizando GTK.
- Inicialmente, muestra un mensaje de bienvenida solicitando al usuario que acerque su tarjeta NFC.
- Cuando se detecta una tarjeta NFC, la aplicación lee el UID de la tarjeta.
- Luego, realiza una solicitud HTTP GET al servidor para obtener el nombre de la persona propietaria de la tarjeta.
- Si la solicitud al servidor es exitosa, muestra un mensaje de bienvenida con el nombre de la persona.
- Si la solicitud al servidor falla, muestra un mensaje de error.
- La aplicación utiliza hilos para mantener la interfaz receptiva mientras se realizan las operaciones de lectura y solicitud HTTP.

## Requisitos

Asegúrate de tener las siguientes bibliotecas instaladas en tu entorno de Python:

- `gi` para la interfaz gráfica GTK.
- `requests` para realizar solicitudes HTTP.
- [puzzle1](https://github.com/AxelBuenoTome/CDR/blob/Fase-2/puzzle1.py) para la lectura del UID de la tarjeta NFC.

## Uso

1. Ejecuta el programa.
2. Acerca una tarjeta NFC al lector.
3. La aplicación mostrará el nombre de la persona si se encuentra en la base de datos del servidor, o mostrará un mensaje de error si no se puede identificar.
4. Puedes cerrar la aplicación en cualquier momento.

## Personalización

Puedes personalizar la interfaz gráfica, agregar más características y modificar el aspecto según tus necesidades.

## Autores

- [Tu Nombre]

## Licencia

Este proyecto está bajo la Licencia [nombre de la licencia]. Puedes obtener más información en el archivo LICENSE.

