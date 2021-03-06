//ENTORNO
var g = 4.622;
var dt = 0.016683;
var timer = null;
var timerFuel = null;

var pause = false;
var juegoEmpezado = false;
var advert = false;
var menu = false;

var audioElement; //música
var musicOn = true;

//NAVE
var y = 5; // altura inicial y0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
var v = 0;
var c = 100;
var a = g; //la aceleración cambia cuando se enciende el motor de a=g a a=-g (simplificado)
var vWin;
//var nave=1; // -----NEW COMENTADO
var nave;
var motorON = false;
var aterrizado = false;
var sinCombustible = false;

var dificultad;

//MARCADORES
var velocidad = null;
var altura = null;
var combustible = null;

//CUENTA ATRÁS
var nContador;
var contador;
var contadorOn = false;

var xmlhttp; //-----NEW

//ejercicio 3
var docXml;


window.onload = function () {

    // indicamos el archivo de audio a cargar
    audioElement = document.createElement('audio');
    // La música empieza a sonar al cargar la página y se repite automáticamente al terminar la pista
    audioElement.setAttribute('autoplay', 'autoplay');
    audioElement.setAttribute('loop', 'loop');
    audioElement.setAttribute('src', 'sound/8-bit-Arcade4.mp3');
    // --------------NEW
    //ejercicio1
    //requestConfigData();
    //------------------------
    setXmlDocument();
    //requestConfigData();

    // Boton cargar configuracion
    $("#load").click(function () {
        setXmlDocument();
    });


    $("#save").click(function () {
        var numeroNave = prompt("¿Que nave quieres guardar? \n Escribe 1 para la nave AZUL \n Escribe 2 para la nave VERDE", "Escribe el número de nave aquí");
        var sonido = prompt("¿Quieres el sonido activado o desactivado? \n Para que el sonido esté ACTIVADO escribe on \n Para que el sonido esté DESACTIVADO escribe off", "sonido");
        var configuracion = prompt("¿Nombre de la configuración?", "Escribe el nombre");
        saveConfigData(numeroNave, sonido, configuracion);
    });

    velocidad = document.getElementById("velocidad");
    altura = document.getElementById("altura");
    combustible = document.getElementById("fuel");

    //botón MENU
    document.getElementById("showm").onclick = function () {
        if (advert == false) {
            if (juegoEmpezado && aterrizado == false) {
                if (menu) {
                    document.getElementsByClassName("menu")[0].style.display = "none";
                    menu = false;
                    reanudarJuego();
                } else {
                    document.getElementsByClassName("menu")[0].style.display = "block";
                    menu = true;
                    pausarJuego();
                }
            } else {
                if (menu) {
                    document.getElementsByClassName("menu")[0].style.display = "none";
                    menu = false;
                    if (juegoEmpezado == false && contadorOn == false) {
                        document.getElementById('dificultad').style.display = 'block';
                    }
                    if (contadorOn) {
                        contador = setInterval(cuentaAtras, 1000);
                    }
                } else {
                    document.getElementsByClassName("menu")[0].style.display = "block";
                    menu = true;
                    if (juegoEmpezado == false) {
                        document.getElementById('dificultad').style.display = 'none';
                    }
                    if (contadorOn) {
                        clearInterval(contador);
                    }
                }
            }
        }
    }


    //botón VOLVER AL JUEGO del menú
    document.getElementById("hidem").onclick = function () {
        if (advert == false) {
            if (juegoEmpezado && aterrizado == false) {
                document.getElementsByClassName("menu")[0].style.display = "none";
                menu = false;
                reanudarJuego();
            } else {
                document.getElementsByClassName('menu')[0].style.display = 'none';
                menu = false;
                if (juegoEmpezado == false && contadorOn == false) {
                    document.getElementById('dificultad').style.display = 'block';
                }
                if (contadorOn) {
                    contador = setInterval(cuentaAtras, 1000);
                }
            }
        }
    }

    //botón CAMBIAR DE NAVE
    //siempre se puede cambiar de nave menos cuando se ha aterrizado
    document.getElementById('cambiarNave').onclick = function () {
        if (aterrizado == false) {
            cambiarNave();
        }
    }


    //mensaje CONFIRM	
    document.getElementsByClassName('aviso')[0].onclick = function () {
        if (advert == false) {
            document.getElementById('adINSTRUCCIONES').style.display = 'block';
            if (contadorOn) {
                clearInterval(contador);
            }
            if (juegoEmpezado && aterrizado == false) {
                pausarJuego();
            }
            advert = true;
        }
    }

    document.getElementsByClassName('aviso')[1].onclick = function () {
        if (advert == false) {
            document.getElementById('adABOUT').style.display = 'block';
            if (contadorOn) {
                clearInterval(contador);
            }
            if (juegoEmpezado && aterrizado == false) {
                pausarJuego();
            }
            advert = true;
        }
    }

    //botones SI/NO del mensaje CONFIRM
    document.getElementById('siINS').onclick = function () {
        location.href = 'instrucciones.html';
    }

    document.getElementById('siAB').onclick = function () {
        location.href = 'about.html';
    }

    document.getElementById('noINS').onclick = function () {
        document.getElementById('adINSTRUCCIONES').style.display = 'none';
        advert = false;
        if (menu == false && juegoEmpezado && aterrizado == false) {
            reanudarJuego();
        }
        if (menu == false && contadorOn) {
            contador = setInterval(cuentaAtras, 1000);
        }
    }

    document.getElementById('noAB').onclick = function () {
        document.getElementById('adABOUT').style.display = 'none';
        advert = false;
        if (menu == false && juegoEmpezado && aterrizado == false) {
            reanudarJuego();
        }
        if (menu == false && contadorOn) {
            contador = setInterval(cuentaAtras, 1000);
        }
    }

    //REINICIAR
    document.getElementsByClassName('reiniciar')[0].onclick = function () {
        if (advert == false) {
            location.href = 'index.html';
        }
    }
    document.getElementsByClassName('reiniciar')[1].onclick = function () {
        if (advert == false) {
            location.href = 'index.html';
        }
    }
    document.getElementsByClassName('reiniciar')[2].onclick = function () {
        if (advert == false) {
            location.href = 'index.html';
        }
    }

    //MOTOR
    //botón POWER (encender/apagar el motor)
    document.getElementById('power').onclick = function () {
        if (advert == false) {
            botonPower();
        }
    }
    //teclado
    document.onkeydown = function (e) { //tecla ESPACIO 
        if (e.keyCode == 32) {
            if (advert == false) {
                teclaEspacioPulsada();
            }
        }
    }
    document.onkeyup = function () {
        motorOff();
    }

    //musica ON/OFF
    document.getElementById("musicOn").addEventListener("click", function () {
        if (musicOn) {
            // hacemos pausa
            if (screen.width > 770) {
                if (aterrizado == false) {
                    audioElement.pause();
                    musicOn = false;
                } else {
                    audioElement.pause();
                    musicOn = false;
                }
            } else {
                audioElement.pause();
                musicOn = false;
            }
            document.getElementById('musicOn').style.display = 'none';
            document.getElementById('musicOff').style.display = 'block';
        }
    });

    document.getElementById("musicOff").addEventListener("click", function () {
        if (musicOn == false) {
            document.getElementById('musicOn').style.display = 'block';
            document.getElementById('musicOff').style.display = 'none';
            // Si deseamos que inicie siempre desde el principio
            //audioElement.currentTime = 0;

            // iniciamos el audio
            if (screen.width > 770) {
                if (aterrizado == false) {
                    audioElement.play();
                    musicOn = true;
                } else {
                    audioElement.play();
                    musicOn = true;
                }
            } else {
                audioElement.play();
                musicOn = true;
            }

        }
    });

    //EMPEZAR EL JUEGO
    document.getElementById('facil').onclick = function () {
        if (advert == false) {
            nivelFacil();
        }
    }

    document.getElementById('dificil').onclick = function () {
        if (advert == false) {
            nivelDificil();
        }
    }
}


//Definición de funciones ---------------------------------------------


function getPromptText() {
    var text = "¿Con que configuración quieres jugar?";

    $(docXml).find('configuracion').each(function (i)
    {
        var nomConfig = $(this).attr('nombre');
        var nave = $(this).find("nave").text();
        var sonido = $(this).find("sonido").text();
        text += "\n CONFIGURACION " + nomConfig + "  nave:" + nave + "  sonido:" + sonido;
    });

    return text;
}

function getConfigName() {
    var nombreConfig = prompt(getPromptText(), "Escribe aquí el nombre de la configuración");
    return nombreConfig;
}

function setXmlDocument() {
    var emess = "Error desconocido";
    $.ajax({
        type: "get",
        url: "ConfiguracionXmlServlet",
        dataType: "xml",
        success: function (dataXml) {
            docXml = dataXml;
            requestConfigData();
        },
        error: function (e) {
            if (e["responseJSON"] === undefined)
                alert(emess);
            else
                alert(e["responseJSON"]["error"]);
        }
    });
}

function requestConfigData() {
    var configuracionSolicitada = getConfigName();
    var configuracionExist = false;

    $(docXml).find('configuracion').each(function (i)
    {
        var nomConfig = $(this).attr('nombre');
        var nave = $(this).find("nave").text();
        var sonido = $(this).find("sonido").text();
        if (nomConfig == configuracionSolicitada) {
            setConfiguracion(nave, sonido);
            configuracionExist = true;
            return;
        }
    });

    if (!configuracionExist) {
        alert("La configuració solicitada no està disponible");
    }
}

function setConfiguracion(nav, son) {
    if (nav == 1) {
        document.getElementById('n').src = 'img/cohete.png';
    } else {
        document.getElementById('n').src = 'img/cohete2.png';
    }

    if (son == "on") {
        document.getElementById('musicOn').style.display = 'block';
        document.getElementById('musicOff').style.display = 'none';
        musicOn = true;
        audioElement.play();
    } else {
        document.getElementById('musicOn').style.display = 'none';
        document.getElementById('musicOff').style.display = 'block';
        musicOn = false;
        audioElement.pause();
    }
}

function saveConfigData(numeroNave, sound, configuracion) {
    var emess = "Error desconocido";
    alert(numeroNave + "-" + sound + "-" + configuracion);

    var url = "ConfiguracionXmlServlet"; //doPost->SaveFile
    $.ajax({
        method: "POST",
        url: url,
        data: {nombre: configuracion, nave: numeroNave, sonido: sound},
        success: function (rsp) {
            alert(rsp["mess"]);
        },
        error: function (e) {
            if (e["responseJSON"] === undefined)
                alert(emess);
            else
                alert(e["responseJSON"]["error"]);
        }
    });
}

function setData(objJson) {
    nave = objJson.nave;

    if (nave == 1) { // meter en una funcion
        document.getElementById('n').src = 'img/cohete.png';
    } else {
        document.getElementById('n').src = 'img/cohete2.png';
    }

    //audioElement.play();

    audioElement.setAttribute('autoplay', 'autoplay');
}


function nivelFacil() {
    document.getElementById('dificultad').style.display = 'none';
    vWin = 3;
    nContador = 2;
    contadorOn = true;
    document.getElementById('contador3').style.display = 'block';
    document.getElementById('velocidad').innerHTML = v.toFixed(1);
    contador = setInterval(cuentaAtras, 1000);
}

function nivelDificil() {

    //La música cambia según el nivel de dificultad
    audioElement.setAttribute('src', 'sound/Fast Ace.wav');
    if (musicOn == false) {
        audioElement.pause();
    }
    document.getElementById('dificultad').style.display = 'none';
    v = 15;
    vWin = 2;
    document.getElementById('velocidad').innerHTML = v.toFixed(1);
    dt = (dt * 2);
    c = 50;
    combustible.style.width = "50%";
    nContador = 2;
    contadorOn = true;
    document.getElementById('contador3').style.display = 'block';
    contador = setInterval(cuentaAtras, 1000);
}

function cuentaAtras() {
    if (nContador > 0) {
        document.getElementById('contador3').innerHTML = nContador;
    } else {
        clearInterval(contador);
        document.getElementById('contador3').style.display = 'none';
        contadorOn = false;
        juegoEmpezado = true;
        start();
    }
    nContador--;
}

function botonPower() {
    //Enciende el motor si ha empezado el juego y no hemos aterrizado, y si hay combustible
    if (juegoEmpezado == true && pause == false && aterrizado == false && sinCombustible == false) {
        if (a == g) {
            motorOn();
        } else {
            motorOff();
        }
    }
}

function pausarJuego() {
    stop();
    pause = true;
    clearInterval(timer);
}

function reanudarJuego() {
    pause = false;
    timer = setInterval(function () {
        moverNave();
    }, dt * 1000);
}

function teclaEspacioPulsada() {
    //El motor se enciende si ha empezado el juego y no hemos aterrizado, y si hay combustible	
    if (juegoEmpezado == true && pause == false && aterrizado == false && sinCombustible == false) {
        motorOn();
    }
}

function cambiarNave() {
    if (nave < 2) { //Sólo hay 2 modelos de nave
        nave++;
    } else {
        nave = 1;
    }

    if (motorON) {
        if (nave == 1) {
            document.getElementById('n').src = 'img/coheteFuego.png';
        } else {
            document.getElementById('n').src = 'img/cohete2Fuego.png';
        }
    } else {
        if (nave == 1) {
            document.getElementById('n').src = 'img/cohete.png';
        } else {
            document.getElementById('n').src = 'img/cohete2.png';
        }
    }
}

function start() {
    //cada intervalo de tiempo mueve la nave
    timer = setInterval(function () {
        moverNave();
    }, dt * 1000);
}

function stop() {

    clearInterval(timer);

    //Al haber aterrizado la velocidad y altura se ponen a 0
    if (aterrizado) { //Sólo si ya hemos aterrizado, no cuando se despliega el menú
        velocidad.innerHTML = 0;
        altura.innerHTML = 0;
    }
}

function moverNave() {
    //cambiar velocidad y posicion
    v += a * dt;
    y += v * dt;
    //actualizar marcadores
    if (v < 0) {  //si la velocidad es negativa pasarla a positiva en el marcador		
        velocidad.innerHTML = (-v).toFixed(1);
    } else {
        velocidad.innerHTML = v.toFixed(1);
    }
    altura.innerHTML = (70 - y).toFixed(1);

    //mover hasta que top sea un 70% de la pantalla

    if (y <= 0) {
        document.getElementById("nave").style.top = "0%";
        v = -v; //Evita que la nave se salga de la pantalla, rebotando...
    } else if (y < 70 && y >= 0) {
        document.getElementById("nave").style.top = y + "%";
    } else { //NAVE ATERRIZADA
        aterrizado = true;
        clearInterval(timerFuel); //Deja de actualizar el marcador de combustible 
        if (nave == 1) {
            document.getElementById("n").src = "img/cohete.png"
        } else {
            document.getElementById("n").src = "img/cohete2.png"
        }
        document.getElementById('power').src = 'img/powerOFF.png'
        stop();
        finalJuego();
    }
}

function motorOn() {
    //Cambio el boton de POWER
    document.getElementById('power').src = 'img/powerON.png'

    //el motor da aceleración a la nave	
    if (aterrizado == false && c > 0) { //Al acelerar sale fuego de la nave, pero sólo si queda combustible y no hemos aterrizado
        a = -g;
        motorON = true;
        if (nave == 1) {
            document.getElementById("n").src = "img/coheteFuego.png"
            //motorON=true;
        } else {
            document.getElementById("n").src = "img/cohete2Fuego.png"
            //motorON=true;
        }
    } else {
        motorOff();
    }

    //mientras el motor esté activado gasta combustible 
    if (aterrizado == false && timerFuel == null)
        timerFuel = setInterval(function () {
            actualizarFuel();
        }, 10);
}

function motorOff() {
    a = g;
    clearInterval(timerFuel);
    timerFuel = null;
    motorON = false;
    //Cambio la imagen de la nave: sin fuego
    if (aterrizado == false) {
        if (nave == 1) {
            document.getElementById("n").src = "img/cohete.png"
        } else {
            document.getElementById("n").src = "img/cohete2.png"
        }
    }
    //Cambio el boton de POWER
    document.getElementById('power').src = 'img/powerOFF.png'
}

function actualizarFuel() {
    //Restamos combustible hasta que se agota

    if (c < 0) {
        document.getElementById('warning').style.display = 'block';
        sinCombustible = true;
        motorOff();
    }
    if (pause == false) {
        c -= 0.1;
        combustible.style.width = c + "%";
    }
}

function finalJuego() {
    if (v > vWin) {  //Has perdido
        //Sonido
        if (screen.width > 770) {
            audioElement.setAttribute('src', 'sound/fail.wav');
            if (musicOn == false) {
                audioElement.pause();
            }
        }
        //Imagen
        document.getElementById('warning').style.display = 'none';
        document.getElementById('final2').style.display = 'block';
        document.getElementsByClassName('velFinal')[1].innerHTML = v.toFixed(1);
        if (nave == 1) {
            document.getElementById("n").src = "img/astronauta3.png";
        } else {
            document.getElementById("n").src = "img/astronauta2.png";
        }
    } else {  //Has ganado	
        if (screen.width > 770) {
            audioElement.setAttribute('src', 'sound/success.wav');
            if (musicOn == false) {
                audioElement.pause();
            }
        }
        document.getElementById('warning').style.display = 'none';
        document.getElementById('final1').style.display = 'block';
        document.getElementsByClassName('velFinal')[0].innerHTML = v.toFixed(1);
        document.getElementById('n').src = 'img/astronauta.png';
    }
}