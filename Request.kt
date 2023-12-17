@file:OptIn(ExperimentalMaterial3Api::class)

package com.example.cliente10

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.cliente10.ui.theme.Cliente10Theme
import kotlinx.coroutines.DelicateCoroutinesApi
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.coroutines.*

//Código Principal

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Cliente10Theme {
                val navController = rememberNavController()

                NavHost(navController = navController, startDestination = "rutaInicial") {
                    composable("rutaInicial") {
                        Pantalla1(navController = navController)
                    }
                    composable("pantallaSiguiente") {
                        Pantalla2(navController = navController)
                    }
                }
            }
        }
    }
}

//Código Pantalla1

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Pantalla1(navController: NavHostController) {
    var hostValue by remember { mutableStateOf("") }
    var usernameValue by remember { mutableStateOf("") }
    var passwordValue by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .height(100.dp), // Altura del encabezado
            color = Color(0xFF252850), // Azul oscuro para el encabezado
            contentColor = Color.White // Color del texto del encabezado
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.Center, // Centra verticalmente
                horizontalAlignment = Alignment.CenterHorizontally // Centra horizontalmente
            ) {
                Text(
                    text = "Course Manager",
                    style = TextStyle(
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    textAlign = TextAlign.Center // Centra el texto horizontalmente
                )
            }
        }


        Surface(
            modifier = Modifier
                .fillMaxSize()
                .weight(1f), // Toma el resto del espacio
            color = Color(0xFFBBDEFB) // Azul claro
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Greeting("Welcome to Course Manager")
                TextField(
                    value = hostValue,
                    onValueChange = { hostValue = it },
                    label = { Text("Host:port/path") },
                    keyboardOptions = KeyboardOptions.Default.copy(imeAction = ImeAction.Next),
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .testTag("Url")
                )

                TextField(
                    value = usernameValue,
                    onValueChange = { usernameValue = it },
                    label = { Text("Nombre Apellido") },
                    keyboardOptions = KeyboardOptions.Default.copy(imeAction = ImeAction.Next),
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .testTag("Username")
                )

                TextField(
                    value = passwordValue,
                    onValueChange = { passwordValue = it },
                    label = { Text("uid password") },
                    keyboardOptions = KeyboardOptions.Default.copy(imeAction = ImeAction.Done),
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .testTag("Password")
                )
                CustomButton(
                    label = "Log In",
                    onClick = {
                            showError = !sendDataToURL(
                                convertURL1(hostValue, usernameValue, passwordValue),
                                "pantalla1",
                                navController
                            )

                    }
                )
                if (showError) {
                    Text(
                        text = "Error en algunos de los campos anteriores: Url, Nombre o Uid",
                        color = Color.Red,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
            }
        }
    }
}


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Pantalla2(navController: NavHostController) {
    var orderValue by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }
    val myData = remember {
        navController.previousBackStackEntry?.arguments?.getString("key_myData")
    }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .height(100.dp), // Altura del encabezado
            color = Color(0xFF252850), // Azul oscuro para el encabezado
            contentColor = Color.White // Color del texto del encabezado
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.Center, // Centra verticalmente
                horizontalAlignment = Alignment.CenterHorizontally // Centra horizontalmente
            ) {
                Text(
                    text = "Course Manager",
                    style = TextStyle(
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    textAlign = TextAlign.Center // Centra el texto horizontalmente
                )
            }
        }


        Surface(
            modifier = Modifier
                .fillMaxSize()
                .weight(1f), // Toma el resto del espacio
            color = Color(0xFFBBDEFB) // Azul claro
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Welcome: Nombre Apellido")
                    CustomButton(
                        label = "Log Out",
                        onClick = {
                            navController.navigate("rutaInicial")
                        }
                    )
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextField(
                        value = orderValue,
                        onValueChange = { orderValue = it },
                        label = { Text("Order") },
                        keyboardOptions = KeyboardOptions.Default.copy(imeAction = ImeAction.Next),
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 16.dp)
                            .testTag("Order")
                    )
                    CustomButton(
                        label = "Send",
                        onClick = {
                                showError = !sendDataToURL(convertURL2(myData.orEmpty(), orderValue), "pantalla2", navController)
                        }
                    )
                    if (showError) {
                        Text(
                            text = "Error en la orden",
                            color = Color.Red,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                }
            }
        }
    }
}


// Función para enviar datos a una URL mediante POST
@OptIn(DelicateCoroutinesApi::class)
private fun sendDataToURL(urlString: String, fromScreen: String, navController: NavHostController): Boolean {
        val url = URL(urlString)
        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "POST"
        connection.doOutput = true
        val host = "${url.protocol}://${url.host}:${url.port}"

        val responseCode = connection.responseCode

        val currentBackStackEntry = navController.currentBackStackEntry
        val arguments = currentBackStackEntry?.arguments

    when (fromScreen) {
            "pantalla1" -> {       // Realizamos acciones específicas para la pantalla 1
                return if (responseCode == HttpURLConnection.HTTP_OK) {
                    val bundle = Bundle()
                    bundle.putString("key_myData", host)

                    navController.navigate("pantallaSiguiente") {
                        launchSingleTop = true
                        popUpTo(navController.graph.startDestinationId) {
                            inclusive = false
                        }
                        arguments?.putAll(bundle)
                    }
                    true
                } else {
                    false
                }
            }
            "pantalla2" -> {        // Realizamos acciones específicas para la pantalla 2
                return responseCode == HttpURLConnection.HTTP_OK
                //Aquí hay que manejar la respuesta, con un handler 
            }
            else -> return false
        }

        connection.disconnect()
    }


    private fun convertURL1(url: String, nombre: String, uid:String): String {
        return "$url/login?nombre=$nombre&$uid"
    }
    
    private fun convertURL2(url: String, order: String): String {
        return "$url/$order"
    }

    @Composable
    fun CustomButton(
        label: String,
        onClick: () -> Unit
    ) {
        Button(
            onClick = { onClick() },    //Aquí se ponen las funciones cuyo evento es el click del botón
            modifier = Modifier.padding(16.dp)
        ) {
            Text(text = label)
        }
    }

    @Composable
    fun Greeting(message: String, modifier: Modifier = Modifier) {
        Text(
            text = message,
            modifier = modifier.then(Modifier.padding(16.dp)),
            textAlign = TextAlign.Center
        )
    }
