import i2clcd

class lcdPrint: 

  def __init__(self):
    self.lcd = i2clcd.i2clcd(i2c_bus=1, i2c_addr=0x27, lcd_width=20)
    self.lcd.init()
    self.current_line = 0

  def Leer(self):
    texto = input("Por favor ingrese un String con \\n para saltos de línea: ")
    return texto.replace("\\n", "\n")
    
  def LimpiarPantalla(self):
    self.lcd.clear()
    self.current_line = 0
  def Imprimir(self, text):
    self.LimpiarPantalla()
    lines = text.split("\n")
    for line in lines:
      self.print_centered(line)

  def print_centered(self, text):
    padding = (20 - len(text)) // 2
    centered_text = " " * padding + text
    self.lcd.print_line(centered_text, self.current_line)
    self.current_line += 1

  def Main(self):
    self.__init__()
    txt = self.Leer()
    self.Imprimir(txt)
    self.current_line = 0

#mi_instancia = Mejorado1()
#mi_instancia.Main()
