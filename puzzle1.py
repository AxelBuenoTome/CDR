import board
import busio
from adafruit_pn532.i2c import PN532_I2C

class RfidReader:
    def __init__(self):
        # Configura la comunicación I2C
        self.i2c = busio.I2C(board.SCL, board.SDA)
        self.pn532 = PN532_I2C(self.i2c, address=0x24)

        # Configura el lector NFC para leer tarjetas MIFARE
        self.pn532.SAM_configuration()

    # Método para leer el UID de la tarjeta NFC en formato hexadecimal
    def read_uid(self):
        try:
            # Espera a que se detecte una tarjeta NFC
            print("Esperando una tarjeta NFC...")
            uid = self.pn532.read_passive_target(timeout=15.0)

            # Si se detecta una tarjeta, imprime su UID
            if uid is not None:
                return format(int.from_bytes(uid, byteorder='big'), 'X')
            else:
                return "No se detectó ninguna tarjeta NFC."
        except Exception as e:
            return "Error: " + str(e)

if __name__ == "__main__":
    rfid = RfidReader()
    uid = rfid.read_uid()
    print(uid)

