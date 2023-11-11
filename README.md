# Explicación del Código

## Librerías Utilizadas

El programa utiliza las siguientes librerías:

- **requests:** Se utiliza para realizar solicitudes HTTP al servidor.
- **gi:** Es parte de GTK (GIMP Toolkit) y se utiliza para la creación de interfaces gráficas en Python.
- **Thread y Event:** Ambas son parte de la librería `threading` y se utilizan para gestionar hilos y eventos.

## Estructura del Programa

### Clase `RFID_Client`

#### Método `__init__(self)`

- Inicializa la ventana de la interfaz gráfica.
- Crea un contenedor de tipo `Gtk.Grid` para organizar los elementos.
- Muestra un mensaje de bienvenida inicial.

#### Método `read_uid_thread(self)`

- Este método se ejecuta en un hilo separado y espera la lectura de un UID de una tarjeta NFC.
- Realiza una solicitud HTTP GET al servidor para obtener el nombre asociado al UID.
- Muestra el nombre en la interfaz y habilita un cuadro de entrada de texto.

#### Método `show_welcome(self, nombre)`

- Muestra el nombre de la persona en la interfaz.
- Añade un botón "Logout" a la interfaz.

#### Método `show_entry(self)`

- Muestra un cuadro de entrada de texto en la interfaz.

#### Método `show_error(self, mensaje)`

- Muestra un mensaje de error en la interfaz.

#### Método `logout(self, widget)`

- Restablece la interfaz para una nueva lectura.
- Elimina el botón "Logout" y el cuadro de entrada de texto.

#### Método `load_css(self)`

- Carga un archivo CSS para personalizar el estilo de la interfaz.

## Uso del Programa

- Se inicia un hilo para la lectura del UID.
- Cuando se lee un UID, se realiza una solicitud al servidor para obtener el nombre asociado.
- Se actualiza la interfaz gráfica mostrando el nombre y habilitando el cuadro de entrada de texto.
- Se pueden realizar acciones como presionar el botón "Logout" o ingresar texto en el cuadro de entrada.

## Notas Adicionales

- La respuesta del servidor se maneja asumiendo que es un nombre, pero se recomienda validar y manejar diferentes respuestas y códigos de estado.
- Se utiliza GTK para la interfaz gráfica, y se carga un archivo CSS para personalizar el estilo.
