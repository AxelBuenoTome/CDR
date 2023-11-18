import requests
import gi
import json
import pandas as pd
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GLib, Pango, Gdk

from threading import Thread, Event
from puzzle_1_4 import RfidReader  # Importa la clase desde el otro archivo
from LCD import Mejorado1  # Importa la clase (Habrá que actualizar Mejorado1)

class RFID_Client(Gtk.Window):
    def __init__(self):
        Gtk.Window.__init__(self, title="NFC Card Reader")
        self.set_default_size(400, 200)
        self.lcd = Mejorado1()
      
        self.grid = Gtk.Grid()
        self.add(self.grid)
        # Inicialmente muestra el mensaje de bienvenida
        self.label = Gtk.Label()
        self.set_welcome_message()
        self.label.get_style_context().add_class("welcome-label")
        self.grid.attach(self.label, 0, 0, 1, 1)  # widget, columna, fila, ancho, alto
      
        self.rfid = RfidReader()
        self.is_reading_event = Event()  # Evento para sincronización
        self.is_reading_event.set()  # Inicialmente, el evento empieza
        self.read_thread = Thread(target=self.read_uid_thread)
        self.read_thread.start()
        self.logout_button = None  # Inicialmente, no se muestra el botón "Logout"
        self.command_text = ""  # Variable para almacenar el texto ingresado
        self.entry = None  # Cuadro de texto para ingresar comandos
      
        # Añadir un TextView para mostrar los datos
        self.textview = Gtk.TextView()
        self.textview.set_editable(False)
        self.textview.set_cursor_visible(False)
      
        # Obtener el buffer del TextView
        self.buffer = self.textview.get_buffer()
      
        self.load_css()  # Método para cargar el archivo CSS

    def set_welcome_message(self):
        self.label.set_markup('<span size="x-large" weight= "bold" foreground="black">Please, login with your university card</span>')
        self.lcd.Imprimir("\nPlease, login with\nyour university card")

    def read_uid_thread(self):
        while True:
            self.is_reading_event.wait()  # Espera a que se permita la lectura
            uid = self.rfid.read_uid()
            # guardamos el uid internamente
            self.uidGuardado = uid
            # Realiza la solicitud HTTP GET al servidor para obtener el nombre
            url = "http://192.168.93.43:3000"  # El de ahora es el localhost y el 10.42.0.26 es la Raspberry
            response = requests.get(url, params={"uid": uid})
            if response.status_code == 200:
                nombre = response.text
              
                GLib.idle_add(self.show_welcome, nombre)
                # Mostrar el cuadro de entrada de texto después de identificar al usuario
                GLib.idle_add(self.show_entry)
              
            else:
                mensaje = "No se pudo obtener el nombre"
                GLib.idle_add(self.show_error, mensaje)
            self.is_reading_event.clear()  # Reiniciar el evento para detener la lectura
            # Añadir un mensaje en la consola para mostrar el UID leído
            print(f"UID leído: {uid}")

    def show_welcome(self, nombre):
        self.label.set_markup(f'<span size="x-large" weight="bold">{nombre}</span>')
        self.lcd.Imprimir("\nWelcome\n"+nombre)
      
        if self.logout_button is None:
            self.logout_button = Gtk.Button(label="Logout")
            # para llamar a los archivos css tenemos que usar la siguiente linea.
            self.logout_button.get_style_context().add_class("logout-button")
            self.logout_button.connect("clicked", self.logout)
            self.grid.attach(self.logout_button, 1, 0, 1, 1)
            self.logout_button.show()

    def show_entry(self):
        # Mostrar el cuadro de entrada de texto
        if self.entry is None:
            self.entry = Gtk.Entry()
            self.grid.attach(self.entry, 0, 1, 1, 1)
            self.entry.connect("activate", self.process_entry)  # Conectar la señal "activate" al procesamiento del texto
            self.entry.show()

    def show_error(self, mensaje):
        self.label.set_markup(f'<span size="x-large" weight="bold" foreground="red">{mensaje}</span>')
        if self.logout_button is not None:
            self.logout_button.hide()

    def logout(self, widget):
        # Restablecer la interfaz para volver a solicitar la tarjeta NFC
        self.set_welcome_message()
        self.is_reading_event.set()  # Permitir una nueva lectura
        if self.logout_button is not None:
            self.grid.remove(self.logout_button)
            self.logout_button.destroy()
            self.logout_button = None
        if self.entry is not None:
            self.grid.remove(self.entry)
            self.entry.destroy()
            self.entry = None

    def process_entry(self, entry):
        # Procesar el texto ingresado cuando se presiona "Enter"
        text = entry.get_text()
        print(f"Texto ingresado: {text}")
      
        # Realiza la solicitud HTTP GET al servidor para obtener las notas
        url = f"http://192.168.93.43:3000/{text}"  # El de ahora es el PC de David (Cerezo) y el 10.42.0.26 es la Raspberry
        params = {"uid": self.uidGuardado}
      
        response = requests.get(url, params=params)
      
        if response.status_code == 200:
            # Llama a la función para imprimir los datos en la consola y en la interfaz gráfica
            self.show_rows(response.text)
        else:
            mensaje = "No se pudieron obtener las notas"
            GLib.idle_add(self.show_error, mensaje)
          
        entry.set_text("")  # Limpiar el cuadro de entrada después de procesar el texto

    def show_rows(self, data):
        try:
            # Intenta cargar la respuesta como JSON
            rows = json.loads(data)
          
            if isinstance(rows, list) and len(rows) > 0:
                # Convierte el JSON a un DataFrame de pandas
                df = pd.DataFrame(rows)
              
                # Muestra el DataFrame en la consola
                print(df)
              
                # Llamar a la función para mostrar el DataFrame en el Gtk.Grid
                GLib.idle_add(self.mostrar_dataframe_en_grid, df)
                # Aplicamos estilos CSS al Gtk.Grid
                self.load_css()
              
            else:
                mensaje = "Respuesta inesperada del servidor"
                GLib.idle_add(self.show_error, mensaje)
              
        except json.JSONDecodeError as e:
            # Si hay un error al decodificar JSON, muestra un mensaje de error
            mensaje = f"Error al decodificar JSON: {e}"
            GLib.idle_add(self.show_error, mensaje)

    def load_css(self):
        css_provider = Gtk.CssProvider()
        css_provider.load_from_path("styles.css")  # Asegúrate de que el archivo CSS esté en la misma carpeta que este script
        screen = Gdk.Screen.get_default()
        style_context = Gtk.StyleContext()
        style_context.add_provider_for_screen(screen, css_provider, Gtk.STYLE_PROVIDER_PRIORITY_USER)

    def mostrar_dataframe_en_grid(self, dataframe):
        # Verificar si el TreeView y ListStore ya están inicializados
        if not hasattr(self, 'treeview'):
            # Crear un modelo de datos para el TreeView
            liststore = Gtk.ListStore(*[str] * len(dataframe.columns))
            for index, row in dataframe.iterrows():
                liststore.append(list(row.astype(str)))
            # Crear el TreeView
            treeview = Gtk.TreeView(model=liststore)
            for i, column in enumerate(dataframe.columns):
                renderer = Gtk.CellRendererText()
                column = Gtk.TreeViewColumn(column, renderer, text=i)
                treeview.append_column(column)
            # Almacenar una referencia al TreeView y ListStore en la instancia de la clase
            self.treeview = treeview
            self.liststore = liststore
            # Añadir el TreeView al Gtk.Grid
            scrolled_window = Gtk.ScrolledWindow()
            scrolled_window.set_hexpand(True)
            scrolled_window.set_vexpand(True)
            scrolled_window.add(treeview)
            self.grid.attach(scrolled_window, 0, 0, 3, 1)
        else:
            # Limpiar el ListStore
            self.liststore.clear()
            # Llenar el ListStore con los nuevos datos del DataFrame
            for index, row in dataframe.iterrows():
                self.liststore.append(list(row.astype(str)))
            # Mostrar los datos en el Gtk.Grid
            GLib.idle_add(self.show_rows, dataframe.to_json())

if __name__ == "__main__":
    client = RFID_Client()
    client.connect("delete-event", Gtk.main_quit)
    client.show_all()
    Gtk.main()
