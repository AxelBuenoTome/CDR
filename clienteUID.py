import requests

# URL de tu servidor Node.js (reemplaza con la dirección correcta)
url = "http://10.42.0.26:3000/obtenerNombre"  # La dirección IP de tu Raspberry Pi

# UID que deseas enviar al servidor
uid = "A12B34C7"  # Reemplaza con el UID que deseas enviar

try:
    response = requests.get(url, params={'uid': uid})

    if response.status_code == 200:
        print("Respuesta del servidor:", response.text)
    else:
        print("El servidor respondió con un código distinto de 200")

except requests.exceptions.RequestException as e:
    print("Error en la solicitud:", e)

