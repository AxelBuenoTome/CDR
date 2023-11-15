import requests
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GLib, Pango, Gdk

from threading import Thread, Event
from puzzle_1_4 import RfidReader  # Importa la clase desde el otro archivo
from LCD import Mejorado1                 # Importa la clase
                                    #EN UNO DE LOS DOS CONSTRUCTORES HABRÁ QUE CAMBIAR LA DIRECCIÓN DEL I2C

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

        self.load_css()  # Método para cargar el archivo CSS

    def set_welcome_message(self):
        self.label.set_markup('<span size="x-large" weight= "bold" foreground="black">Please, login with your university card</span>')
        self.lcd.Imprimir("\nPlease, login with your university card")            #

    def read_uid_thread(self):
        while True:
            self.is_reading_event.wait()  # Espera a que se permita la lectura
            uid = self.rfid.read_uid()
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
         self.lcd.Imprimir("\n      Welcome\n"+nombre)            #

        if self.logout_button is None:
            self.logout_button = Gtk.Button(label="Logout")
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
        #Aquí probaremos lo de enviar un request
        # Realiza la solicitud HTTP GET al servidor para obtener el nombre
        url = "http://10.42.0.26:3000/obtenerNombre"
        response = requests.get(url, params={"uid": text})
        if response.status_code == 200:
            nombre = response.text
            print(f"Request devuelto: {nombre}")
        else:
            mensaje = "No se pudo obtener el nombre"
        entry.set_text("")  # Limpiar el cuadro de entrada después de procesar el texto

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
