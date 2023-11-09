import requests
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, GLib, Pango, Gdk

from threading import Thread, Event
from puzzle_1_4 import RfidReader  # Importa la clase desde el otro archivo

class RFID_Client(Gtk.Window):
    def __init__(self):
        Gtk.Window.__init__(self, title="NFC Card Reader")
        self.set_default_size(400, 200)

        self.box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=10)
        self.add(self.box)

        # Inicialmente muestra el mensaje de bienvenida
        self.label = Gtk.Label(label="Please, login with your university card", name="label")
        self.label.set_markup('<span size="x-large" weight= "bold" foreground="black">Please, login with your university card</span>')
        self.label.get_style_context().add_class("welcome-label")
        #self.label.override_background_color(Gtk.StateFlags.NORMAL, Gdk.RGBA(0.5, 0.5, 1, 1))  # Cambia el color de fondo a azul
        self.box.pack_start(self.label, True, True, 0)

        self.rfid = RfidReader()
        self.is_reading_event = Event()  # Evento para sincronización
        self.is_reading_event.set()  # Inicialmente, el evento empieza
        self.read_thread = Thread(target=self.read_uid_thread)
        self.read_thread.start()
    
    def read_uid_thread(self):
        while True:
            self.is_reading_event.wait()  # Espera a que se permita la lectura
            uid = self.rfid.read_uid()
            # Realiza la solicitud HTTP GET al servidor para obtener el nombre
            url = "http://10.42.0.26:3000/obtenerNombre" #Escribir el UID de la RPi
            response = requests.get(url, params={"uid": uid})
            if response.status_code == 200:
                nombre = response.text
                GLib.idle_add(self.show_welcome, nombre)
            else:
                mensaje = "No se pudo obtener el nombre"
                GLib.idle_add(self.show_error, mensaje)
            
            self.is_reading_event.clear()  # Reiniciar el evento para detener la lectura
            # Añadir un mensaje en la consola para mostrar el UID leído
            print(f"UID leído: {uid}")

    def show_welcome(self, nombre):
        self.label.set_markup(f'<span size="x-large" weight="bold">{nombre}</span>')

    def show_error(self, mensaje):
        self.label.set_markup(f'<span size="x-large" weight="bold" foreground="red">{mensaje}</span>')

if __name__ == "__main__":
    client = RFID_Client()
    client.connect("delete-event", Gtk.main_quit)
    client.show_all()
    Gtk.main()

