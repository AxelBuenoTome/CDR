var loginStatus = false;
//Función utilizada en la primera version para comprovar el correcto funcionamiento de las requests
function sendGetRequest() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById("response").innerHTML = xhr.responseText;
    }
  };
  xhr.open("GET", "http://localhost:3000/students", true);
  xhr.send();
}
/*
async function sendPostRequest(username, password) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "http://localhost:3000/login?nombre=" +
      encodeURIComponent(username) +
      "&uid=" +
      encodeURIComponent(password),
    true
  );

  xhr.onload = function () {
    if (this.status == 200) {
      loginStatus = true;
      //console.log(this.status==200);
      var response = JSON.parse(this.responseText);
      var responseElement = document.getElementById("response");
      responseElement.textContent = JSON.stringify(response, null, 2);
      responseElement.style.display = "block";
      showWelcomeScreen(username);
    }else{
      loginStatus = false;
    }
  };
  xhr.send();
}*/

async function sendPostRequest(username, password) {
  try {
    const response = await fetch(`http://localhost:3000/login?nombre=${encodeURIComponent(username)}&uid=${encodeURIComponent(password)}`);
    if (response.ok) {
      const responseData = await response.json();

      if (responseData.Success === true) {
        loginStatus = true;
        //var responseElement = document.getElementById("response");
        //responseElement.textContent = JSON.stringify(responseData, null, 2);
        //responseElement.style.display = "block";
        //Me guardo username y password
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        showDashboard(username);
      } else {
        loginStatus = false;
      }
    } else {
      loginStatus = false;
    }
  } catch (error) {
    console.error("Error in sendPostRequest:", error);
    loginStatus = false;
  }
}


//sendPostRequest(document.getElementById('username').value, document.getElementById('password').value);"
async function handleLoginFormSubmit(event) {
  event.preventDefault();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  
  if (!username || !password) {
    alert("Please enter both a username and password.");
    return;
  }
  sendPostRequest(username, password);
}

/*
function handleLoginFormSubmit(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    if (!username || !password) {
      alert("Please enter both a username and password.");
      return;
    }
    sendPostRequest(username, password);
}*/

function showDashboard(username) {
  document.getElementById('loginShow').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  //var dashboardElement = document.getElementById("dashboard");
  //dashboardElement.textContent = "Welcome, " + username + "!";
  //dashboardElement.style.display = "block";

  // Hide the login form and show the welcome message
  //var loginForm = document.getElementById("loginForm");
  //loginForm.style.display = "none";
}

async function sendSearchRequest(searchQuery) {
  console.log("Search query:", searchQuery);

  try {
    //encoded no sirve, mejor directamente searchquery!
    //const encodedQuery = customEncodeURIComponent(searchQuery);
    console.log(searchQuery);

    const response = await fetch(`http://localhost:3000/${searchQuery}&uid=${localStorage.getItem('password')}`, {
      method: 'GET',
      // No need to include 'Content-Type' for GET requests
    });
    console.log(`http://localhost:3000/${searchQuery}&uid=${localStorage.getItem('password')}`);

    //console.log(`http://localhost:3000/${searchQuery}`);

    if (response.ok) {
      const responseData = await response.json();
      document.getElementById("table").style.display="block";
      //document.getElementById("table").innerHTML=tableCreator(responseData);
      //tableCreator(responseData).then(document.getElementById("table").innerHTML);
      tableCreator(responseData).then(value => {
        document.getElementById("table").innerHTML=value;
        console.log(value);
      })
      // Process the server response here
      console.log('Server response:', responseData);
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
/* No funciona ya que tengo que enviar objetos promise al trabajar en async
Esta version solo funciona para modelos no asincronos

async function tableCreator(data){
  //"<table border='1px'>
  var tabla = "<tr>";

  for(var key in data[0]){
    console.log(key);
    tabla+="<th>"+key+"</th>";
  }
  tabla+="</tr>";
  for(var key1 in data){
    tabla+="<tr>";
    for(var value in data[key1]){
      tabla+="<td>"+data[key1][value]+"</td>";
      //console.log(data[key1][value]);
    }
    tabla+="</tr>";
  }

  //console.log(data[0]);
  //tabla+="</table>";
  return tabla;
}
*/

async function tableCreator(data) {
  return new Promise(resolve => {
    var tabla = "<table border='1px solid black'><tr>";
    //Algoritmo de barrido de columna

    //Titulos de las columnas
    for (var key in data[0]) {
      console.log(key);
      tabla += "<th>" + key + "</th>";
    }
    tabla += "</tr>";

    //primer for da indices de posicion en columna
    for (var key1 in data) {
      tabla += "<tr>";
      //Da datos para cada indice y de izquierda a derecha para columna
      for (var value in data[key1]) {
        tabla += "<td>" + data[key1][value] + "</td>";
      }
      tabla += "</tr>";
    }

    tabla += "</table>";
    resolve(tabla);
  });
}

function logout(){
  localStorage.removeItem('username');
  localStorage.removeItem('password')
  document.getElementById("loginForm").reset();
  document.getElementById("table").style.display="none";
  document.getElementById('loginShow').style.display = 'block';
  document.getElementById("dashboard").style.display="none";

}
//Cuando hago logout BORRO TABLA!!!



//document.getElementById('loginForm').addEventListener('submit', handleLoginFormSubmit);
//document.getElementById('searchForm').addEventListener('click', sendSearchRequest);