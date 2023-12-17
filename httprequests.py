import urllib.request
import urllib.parse

class httprequests:
    @staticmethod
    def get(url, handler):
        try:
            response = urllib.request.urlopen(url)
            if response.getcode() == 200:
                handler(response.read().decode('utf-8'))
            else:
                handler(f"Error: {response.getcode()}")
        except Exception as e:
            handler(f"Error: {str(e)}")
