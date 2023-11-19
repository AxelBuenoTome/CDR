import requests
import gi
import json
import pandas as pd
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GLib, Pango, Gdk

from threading import Thread, Event
from puzzle_1_4 import RfidReader  # Importa la clase desde el otro archivo
from LCD import Mejorado1  # Importa la clase

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
        self.grid.attach(self.label, 0, 0, 1, 1)

        self.rfid = RfidReader()
        self.is_reading_event = Event()  # Evento para sincronización
        self.is_reading_event.set()  # Inicialmente, el evento empieza
        self.read_thread = Thread(target=self.read_uid_thread)
        self.read_thread.start()
        self.logout_button = None  # Inicialmente, no se muestra el botón "Logout"
        self.command_text = ""  # Variable para almacenar el texto ingresado
        self.entry = None  # Cuadro de texto para ingresar comandos

        # Inicializar TreeView y ListStore
        self.liststore = Gtk.ListStore()  # Ajusta el número de columnas según tus datos
        self.treeview = Gtk.TreeView()
        # Agregar el TreeView al grid
        self.grid.attach(self.treeview, 0, 3, 1, 1)

        # Nuevo label para mostrar información del DataFrame
        self.label_result = Gtk.Label()
        self.grid.attach(self.label_result, 0, 2, 1, 1)  # Adjunta el label al grid

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
            url = "http://10.42.0.26:3000/obtenerNombre"
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
        if self.treeview is not None:
            self.treeview.hide()

    def show_entry(self):
        # Mostrar el cuadro de entrada de texto
        if self.entry is None:
            self.entry = Gtk.Entry()
            self.grid.attach(self.entry, 0, 1, 1, 1)
            self.entry.connect("activate", self.process_entry)  # Conectar la señal "activate" al procesamiento del texto
            self.entry.show()
        if self.treeview is not None:
            self.treeview.hide()

    def show_error(self, mensaje):
        self.label.set_markup(f'<span size="x-large" weight="bold" foreground="red">{mensaje}</span>')
        if self.treeview is not None:
            self.treeview.hide()

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
        if self.treeview is not None:
            self.treeview.hide()
    def process_entry(self, entry):
        # Procesar el texto ingresado cuando se presiona "Enter"
        text = entry.get_text()
        print(f"Texto ingresado: {text}")

        # Realiza la solicitud HTTP GET al servidor para obtener las notas
        url = f"http://10.42.0.26:3000/{text}"
        params = {"uid": self.uidGuardado}

        response = requests.get(url, params=params)

        if response.status_code == 200:
            # Llama a la función para imprimir los datos en la consola y en la interfaz gráfica
            self.show_rows(response.text)
        else:
            mensaje = "No se pudieron obtener las notas"
            GLib.idle_add(self.show_error, mensaje)

        entry.set_text("")  # Limpiar el cuadro de entrada después de procesar el text

    def show_rows(self, data):
        try:
            # Intenta cargar la respuesta como JSON
            rows = json.loads(data)

            if isinstance(rows, list) and len(rows) > 0:
                # Convierte el JSON a un DataFrame de pandas
                df = pd.DataFrame(rows)

                # Muestra el DataFrame en la consola
                print(df)

                # Convertir todos los valores del DataFrame a cadenas
                df = df.map(str)

                GLib.idle_add(self.modify_treeview, df)
            else:
                mensaje = "Respuesta inesperada del servidor"
                GLib.idle_add(self.show_error, mensaje)

        except json.JSONDecodeError as e:
            # Si hay un error al decodificar JSON, muestra un mensaje de error
            mensaje = f"Error al decodificar JSON: {e}"
            GLib.idle_add(self.show_error, mensaje)

    def init_liststore(self, num_columns):
        # Inicializar ListStore dinámicamente con el número de columnas
        types = [str] * num_columns
        print(num_columns)
        self.liststore = Gtk.ListStore(*types)

        # Configurar las columnas en el TreeView
        for i in range(num_columns):
            renderer = Gtk.CellRendererText()
            column = Gtk.TreeViewColumn("", renderer, text=i)
            column.set_resizable(True)
            self.treeview.append_column(column)

        # Añadir el ListStore al TreeView
        self.treeview.set_model(self.liststore)

    def modify_treeview(self,df):
        # Obtener el número de columnas y nombres de las columnas
        num_columns = len(df.columns)
        column_names = df.columns.tolist()

        # Si el ListStore está vacío, inicialízalo dinámicamente
        if not self.liststore.get_iter_first():
            self.init_liststore(num_columns)

        # Limpiar el ListStore antes de agregar nuevas filas
        self.liststore.clear()

        # Agregar filas al modelo de datos
        for _, row in df.iterrows():
            self.liststore.append(row.tolist())

        # Configurar las columnas en el TreeView
        for i, column_title in enumerate(column_names):
            column = self.treeview.get_column(i)
            column.set_title(column_title)
        self.treeview.show()


    def load_css(self):
        css_provider = Gtk.CssProvider()
        css_provider.load_from_path("styles.css")  # Asegúrate de que el archivo CSS esté en la misma carpeta que este script
        screen = Gdk.Screen.get_default()
        style_context = Gtk.StyleContext()
        style_context.add_provider_for_screen(screen, css_provider, Gtk.STYLE_PROVIDER_PRIORITY_USER)

if __name__ == "__main__":
    client = RFID_Client()
    client.connect("delete-event", Gtk.main_quit)
    client.show_all()
    Gtk.main()

