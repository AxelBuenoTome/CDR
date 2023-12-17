window.addEventListener("load", function () {

    var username = getCookie("username")
    var password = getCookie("password")
    if (username == "") {
        showLogin()
    } else {
        showDashboard(username, password)
    }

});

function login(form) {
    const XHR = new XMLHttpRequest();
    const FD = new FormData(form);

    var username = FD.get('username')
    var password = FD.get('password')
    var query = "http://localhost:3000/students?uid=" + String(password)

    XHR.addEventListener("load", function (event) {
        if (this.status === 200 && this.response != "ERROR") {
            let res = JSON.parse(this.response);

            if (res.nom == username && res.uid == password) {
                // User Logged In
                document.getElementById('loginErrors').style.display = 'none';

                // Go To Dashboard = uid =
                document.cookie = "username=" + username;
                document.cookie = "password=" + password;
                showDashboard(username, password)
            } else {
                // Display login errors
                document.getElementById('loginErrors').style.display = 'block';
            }

        } else {
            // Display login errors
            document.getElementById('loginErrors').style.display = 'block';
        }
    });

    // Set up and send our request asynchronously
    XHR.open("GET", query, true);
    XHR.send();
}

function showLogin() {
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'login.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("principal").innerHTML = xhr.responseText;

            const form = document.getElementById("login-screen");

            form.addEventListener("submit", function (event) {
                event.preventDefault(); // Prevent Page Reload
                login(form);
            });
        }
    }
    xhr.send();
}

function showDashboard() {
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'tabla.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("principal").innerHTML = xhr.responseText;
            document.getElementById('welcomeText').innerText = username;

            // Send Query
            const sendQueryBtn = document.getElementById("sendQueryBtn");
            sendQueryBtn.addEventListener("click", function (event) {
                let query = document.getElementById("searchBar").value;
                sendQuery(query, password)
            });


            // Logout
            const logoutBtn = document.getElementById("logoutBtn");
            logoutBtn.addEventListener("click", function (event) {
                document.cookie = "password="
                document.cookie = "username="
                showLogin()
            });
        }
    }
    xhr.send();
}

function sendQuery(query, password){
    const XHR = new XMLHttpRequest();

    if(!(query.includes('tasks') || query.includes('timetables') || query.includes('marks'))){
        document.getElementById('query_err').style.display = 'block'
    }else{
        document.getElementById('query_err').style.display = 'none'
    }
    console.log(query)

    let str = ""
    if (query.includes('?')) {
        str = "http://localhost:3000/" + query + "&uid=" + password
    } else {
        str = "http://localhost:3000/" + query + "?uid=" + password
    }

    XHR.addEventListener("load", function (event) {
        if (this.status === 200 && this.response != "ERROR") {
            let data = JSON.parse(this.response)


            document.getElementById('queryTable').innerText = str

            renderTable(data)


        } else {

        }
    });

    // Set up and send our request asynchronously
    XHR.open("GET", str, true);
    XHR.send();
}


function renderTable(data){
    console.log(data)

    let keys = [];
    for (let k in data[0]) keys.push(k);

    str = "<tr>"
    for (let i in keys) {
        str += "<th>" + keys[i] + "</th>"
    }
    str += "</tr>"

    for (let i in data) {
        str += "<tr>"
        for (let k in keys) {
            str += "<td>" + data[i][keys[k]] + "</td>"

        }
        str += "</tr>"

    }

    document.getElementById('resultsTable').innerHTML = str;

}


function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}