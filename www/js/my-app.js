//
var app = new Framework7({
    // App root element
    root: '#appPruebaMqtt',
    // App Name
    name: 'appPruebaMqtt',
    // App id
    id: 'com.appPruebaMqtt',
    // Enable swipe panel
    panel: {
        swipe: 'left'
    },
    // Add default routes
    routes: [
        {
            path: '/home/',
            url: 'index.html'
        }
    ],
    // ... other parameters
});

//
var $$ = Dom7;

//
var mainView = app.views.create('.view-main');

//
var arrayU = [];

//
document.addEventListener('deviceready', function () {
    //
    if (localStorage.dir === undefined) {
        //
        app.dialog.prompt('', 'Texto', function (dir) {
            //
            localStorage.dir = dir;
            $$('#direccion').html(dir);
        });
    } else {
        //
        $$('#direccion').html(localStorage.dir);
    }
    //
    cordova.plugins.CordovaMqTTPlugin.connect({
        url: 'tcp://165.227.89.32', //a public broker used for testing purposes only. Try using a self hosted broker for production.
        port: '1883',
        clientId: 'com.appPruebaMqtt',
        willTopicConfig: {
            qos: 0, //default is 0
            retain: false, //default is true
            topic: "appNotificacionesLT/notificaciones",
            payload: ""
        },
        username: "fabian",
        password: '1234',
        success: function (s) {
//            alert('conectado');
        },
        error: function (e) {
//            alert('error al conectar');
        },
        onConnectionLost: function (e) {
//            alert('desconectado');
        }
    });
});

//
function editarDireccion() {
    //
    app.dialog.prompt('', 'Texto', function (dir) {
        //
        localStorage.dir = dir;
        $$('#direccion').html(dir);
    });
}

//
function llamado() {
    //
    if (localStorage.dir !== '' && localStorage.dir !== undefined) {
        //
        cordova.plugins.CordovaMqTTPlugin.publish({
            topic: 'appNotificacionesLT/notificaciones',
            payload: localStorage.dir,
            qos: 0,
            retain: false,
            success: function (s) {
                //
                alert('Texto Enviado!');
                //
                $$('#btnLlamado').addClass('disabled');
                $$('#btnLlamado').addClass('color-gray');
                tiempo();
            },
            error: function (e) {
                //alert("err!! something is wrong. check the console")
            }
        });
    } else {
        //
        app.dialog.prompt('', 'Texto', function (dir) {
            //
            localStorage.dir = dir;
            $$('#direccion').html(dir);
        });
    }
}

//
function tiempo() {
    //
    var controlColorDivT = 0;
    //
    var intervaloC = setInterval(function () {
        //
        controlColorDivT++;
        //
        $$('#tiempo').html(5 - controlColorDivT);
        //
        if (controlColorDivT >= 5) {
            //
            $$('#btnLlamado').removeClass('disabled');
            $$('#btnLlamado').removeClass('color-gray');
            $$('#tiempo').html('');
            //
            clearInterval(intervaloC);
        }
    }, 1000);
}