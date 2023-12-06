from gi.repository import Gtk, GLib, Pango, Gdk
from threading import Thread, Event
from puzzle1 import RfidReader
from LCD import lcdPrint
import json
import gi
gi.require_version('Gtk', '3.0')

def request_handler(url):
    try:
        import urllib.request

        # Realizar la solicitud a la URL
        with urllib.request.urlopen(url) as response:
            if response.getcode() == 200:
                # Leer y mostrar el contenido de la respuesta
                content = response.read().decode('utf-8')  # Decodificar el contenido a texto
                print("Request exitoso:")
                print("Contenido de la respuesta:", content)
            else:
                print(f"Error en el request. Código de estado: {response.getcode()}")
    except urllib.error.URLError as e:
        print("Error en el request:", e)

# URL a la que se hará el request (puedes cambiarla por la URL que desees)
url = 'https://www.ejemplo.com'
request_handler(url)
######
######
######
######
######
######

class RFID_Client(Gtk.Window):
    def __init__(self):
        Gtk.Window.__init__(self, title="NFC Card Reader")
        self.set_default_size(400, 200)
        self.lcd = lcdPrint()

        self.grid = Gtk.Grid()
        self.add(self.grid)

        # Inicialmente muestra el mensaje de bienvenida
        self.label = Gtk.Label()
        self.labelerror = Gtk.Label()
        self.set_welcome_message()
        self.label.get_style_context().add_class("welcome-label")
        self.grid.attach(self.label, 0, 0, 1, 1)
        self.grid.attach(self.labelerror, 0, 2, 1, 1)
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

        # Temporizador para el logout automático después de 15 segundos
        self.timeout_id = 0
        self.time = 10 #tiempo en segundos del timer
        
        self.load_css()  # Método para cargar el archivo CSS

        self.init_handlers()  # Llama a un método para inicializar los handlers

    def init_handlers(self):
        # Conecta los handlers a las señales correspondientes
        self.connect("delete-event", Gtk.main_quit)
        if self.logout_button is not None:
            self.logout_button.connect("clicked", self.on_logout_button_clicked)
        if self.entry is not None:
            self.entry.connect("activate", self.on_entry_activated)
            self.entry.connect("changed", self.on_entry_changed)  # Conectar la señal "changed" para reiniciar el temporizador

    def on_logout_button_clicked(self, widget):
        # Lógica para manejar el clic del botón "Logout"
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
        if self.labelerror is not None:
            self.labelerror.hide()

    def on_entry_activated(self, entry):
        # Lógica para manejar la activación del cuadro de entrada de texto
        text = entry.get_text()
        print(f"Texto ingresado: {text}")
        self.treeview_name(text)  # Nos quedamos con el nombre de lo que solicitamos
        url = f"http://10.42.0.26:3000/{text}"
        params = {"uid": self.uidGuardado}
        response = requests.get(url, params=params)
        # (Re)iniciar el temporizador
        self.restart_timeout()
        if response.status_code == 200:
            self.show_rows(response.text)

        else:
            mensaje = "No se pudieron obtener las notas"
            GLib.idle_add(self.show_error, mensaje)

        entry.set_text("")  # Limpiar el cuadro de entrada después de procesar el texto

    def on_entry_changed(self, entry):
        # Lógica para manejar el cambio en el cuadro de entrada
        # Reiniciar el temporizador cada vez que se introduce algo en el cuadro de entrada
        self.restart_timeout()

    def restart_timeout(self):
        # (Re)iniciar el temporizador
        if self.timeout_id:
            GLib.source_remove(self.timeout_id)
        # Establecer el temporizador a 15 segundos
        self.timeout_id = GLib.timeout_add_seconds(self.time, self.auto_logout)

    def auto_logout(self):
        # Lógica para el logout automático después de 15 segundos de inactividad
        print("Auto Logout")
        self.on_logout_button_clicked(None)  # Simular clic en el botón Logout

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
                # (Re)iniciar el temporizador después de una entrada exitosa
                self.restart_timeout()
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
        self.labelerror.set_markup(f'<span size="x-large" weight="bold" foreground="red">{mensaje}</span>')
        self.labelerror.show()
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
        if self.labelerror is not None:
            self.labelerror.hide()

    def process_entry(self, entry):
        # Procesar el texto ingresado cuando se presiona "Enter"
        text = entry.get_text()
        print(f"Texto ingresado: {text}")
        self.treeview_name(text) #nos quedamos con el nombre de lo que solicitamos
        # Realiza la solicitud HTTP GET al servidor para obtener las notas
        url = f"http://10.42.0.26:3000/{text}"
        params = {"uid": self.uidGuardado}

        response = requests.get(url, params=params)
        # (Re)iniciar el temporizador después de una entrada exitosa
        self.restart_timeout()
        
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
                print(self.tree_name)
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
        # Limpiar las columnas existentes en el TreeView
        for column in self.treeview.get_columns():
            self.treeview.remove_column(column)

        # Inicializar ListStore dinámicamente con el número de columnas
        types = [str] * num_columns
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

            
        #mostramos el treeview
        self.treeview.show()
        #mostramos el nombre del treeview
        self.labelerror.show()
        self.labelerror.set_markup(f'<span size="x-large" weight="bold" foreground="black">{self.tree_name}</span>')

    def treeview_name(self,data):
        # Buscar el índice del signo "?" en la cadena
        index = data.find("?")
        # Tomar la subcadena antes del signo "?" (o la cadena completa si no se encuentra)
        self.tree_name = data[:index] if index != -1 else data
        print(f"nombre de la tabla: {self.tree_name}")

    def set_welcome_message(self):
        self.label.set_markup('<span size="x-large" weight= "bold" foreground="black">Please, login with your university card</span>')
        self.lcd.Imprimir("\nPlease, login with\nyour university card")

    def load_css(self):
        css_provider = Gtk.CssProvider()
        css_provider.load_from_path("styles.css")  # Asegúrate de que el archivo CSS esté en la misma carpeta que este script
        screen = Gdk.Screen.get_default()
        style_context = Gtk.StyleContext()
        style_context.add_provider_for_screen(screen, css_provider, Gtk.STYLE_PROVIDER_PRIORITY_USER)

if __name__ == "__main__":
    client = RFID_Client()
    client.show_all()
    Gtk.main()
