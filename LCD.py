import i2clcd

class Mejorado1: 

  def __init__(self):
    self.lcd = i2clcd.i2clcd(i2c_bus=1, i2c_addr=0x27, lcd_width=20)
    self.lcd.init()

  def Leer(self): #Devuelve un String que contiene entre 0 y 80 caracteres
    texto = input("Por favor ingrese un String: ") 
    return MaxCar(texto)    #No he comprobado si funciona (aún)

  def Imprimir(self, text):
    for i, line in enumerate(text.splitlines()): 
      self.lcd.print_line(line, i)

  def MaxCar(self, text):
    while(len(text)>80):
      print("Has puesto más caracteres de los que se puede, ingrese otro String")
      text = input("Por favor ingrese otro String: ")
    return text
        
  def Main(self):
    self.__init__()
    txt= self.Leer()
    self.Imprimir(txt)
