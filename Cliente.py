import requests
import i2clcd

# URL de tu servidor Node.js (reemplaza con la dirección correcta)
url = "http://10.42.0.26:3000/obtenerNombre"  # La dirección IP de tu Raspberry Pi

# Más adelante habrá que hacerlo en el constructor, y la dirección del i2c_addr, se tiene que comprobar cual es una vez se conecte el LCD con la raspberry
self.lcd = i2clcd.i2clcd(i2c_bus=1, i2c_addr=0x27, lcd_width=20)
self.lcd.init()

#Función para imprimir por el LCD el texto introducido por pantalla
def Imprimir(self, text):
    for i, line in enumerate(text.splitlines()): 
      self.lcd.print_line(line, i)

# UID que deseas enviar al servidor
uid = "A12B34C7"  # Reemplaza con el UID que deseas enviar

try:
    response = requests.get(url, params={'uid': uid})
    self.Imprimir("\nPlease, login with your university card")
    if response.status_code == 200:
        print("Respuesta del servidor:", response.text)
        self.Imprimir("\nWellcome\n"+response.text) #Esto no sé hasta que punto está bien
    else:
        print("El servidor respondió con un código distinto de 200")

except requests.exceptions.RequestException as e:
    print("Error en la solicitud:", e)
