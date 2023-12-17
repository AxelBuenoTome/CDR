    var username = document.getElementById('name').value;
    var password = document.getElementById('password').value;
    const login = document.getElementById('login');

    // Verificar las credenciales 

    const getData = () => {
        const xhr = new XMLHttpRequest();
        const FD = new FormData(form);

        var username = FD.get(username)
        var password = FD.get(password)
        var query = "http://localhost:3000/students?uid=" +String(password)

        //xhr.open('GET', 'http://localhost:3000/students?uid=36A4E8B2');
        //xhr.open('GET', 'http://localhost:3000/students');
        xhr.open('GET', 'http://localhost:3000/marks?uid=36A4E8B2');

        xhr.onload =() => {
            const data = JSON.parse(xhr.response);
            console.log(data);
        };

        xhr.send();
    
    };

    login.addEventListener('click', getData);  