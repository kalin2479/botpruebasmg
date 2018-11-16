'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAAGIcYYwdHsBAOHoP34oL3gr7Y5gD5tNZAlx2tGAbDwKkjhYN0iDc3HBR3yKMjZAndHB5Q6hh7ZCojZCWwfnyKCZAAFfMfqIksgBD0kJuGvWJQnIdbu9NJEUYHUO1cpme4nPiOmE2dkVmLHZAlvZBFyZCgBbjZAwFuaOtxS3GbrQUfgZDZD"

const app = express();

app.set('port', (process.env.PORT || 5000 ));
// lo que va ha recibir por el api de facebook, para poder entender elementos json
// que recibe de nuestro api
app.use(bodyParser.json());
app.get('/', function(req,response){
  response.send('hola mundo');
});
// Vamor a;adir  el webhook con el cual vamos a verificar con un token la asignacion
// y conexion que tendra nuestra api de facebook con nuestro servidor de express
app.get('/webhook',function(req,response){
  if(req.query['hub.verify_token'] === 'kalin_token'){
    response.send(req.query['hub.challenge']);
  }else{
    response.send('No tienes permisos');
  }
});


// para saber que nos esta enviando si es texto o un adjunto
app.post('/webhook', function(req,res){
  const webhook_event = req.body.entry[0];
  if (webhook_event.messaging){
    webhook_event.messaging.forEach(event => {
      // console.log(event);
      // handleMessage(event);
      handleEvent(event.sender.id,event);
    });
  };
  // Le indicamos que hemos recibido el mensaje
  res.sendStatus(200);
});


// Manejador de mensajes,



function handleEvent(senderId,event){
  // Esta funcion nos va indicar que es lo que esta recibiendo y de esta manera procesar
  // es decir si es texto, adjunto, etc.

  // Analizamos si es un mensaje de texto lo que estamos recibiendo
  // console.log(event.message)
  if (event.message){
    // console.log(111);
    handleMessage(senderId,event.message);
  }else{
    // console.log(22);
    handlePostback(senderId,event.postback.payload, event);


  }
}

function handleMessageButtom(senderId, event){
  let playOption = event.postback.payload;
  let messageData = {};
  // console.log(playOption);
  switch (playOption) {
    case "NO_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "Recuerda que puedes encontrarme ahí, en nuestro exclusivo Pop Up Store. Ahí podrás encontrar el regalo perfecto. ¿En qué whisky estás interesado?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "JW Gold",
              "payload": "JW_GOLD_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW 18 años",
              "payload": "JW_18_ANNOS_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW XR 21 años",
              "payload": "JW_XR_21_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW Green",
              "payload": "JW_GREEN_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW White Walker",
              "payload": "JW_WHITE_WALKER_PAYLOAD"
            }
          ]
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
    case "SI_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "¿En qué nivel te encuentras?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Sótano",
              "payload": "SOTANO_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "Entrada",
              "payload": "ENTRADA_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "Saga - Nivel 2",
              "payload": "SAGA_NIVEL_2_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "Ripley - Nivel 2",
              "payload": "RIPLEY_NIVEL_2_PAYLOAD"
            }
          ]
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
  }
}

function defaultMessage(senderId, event){
  // quick_rplies : son respuesta rapidas
  let playOption = "EMPEZAR";
  let messageData = {};
  // console.log(playOption)
  if (event != undefined){
    if (event.quick_reply != undefined){
      playOption = event.quick_reply.payload;
    }else{
      playOption = "";
      // console.log("0");
    }
    // console.log(event.quick_reply.payload)
  }
  switch (playOption) {
    case "JW_XR_21_NO_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "No hay problema, estoy seguro que encontrarás el regalo perfecto. Keep Walking."
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
    case "JW_XR_21_SI_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "¿En qué whisky estás interesado?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "JW Gold",
              "payload": "JW_GOLD_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW 18 años",
              "payload": "JW_18_ANNOS_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW XR 21 años",
              "payload": "JW_XR_21_ANNOS_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW Blue",
              "payload": "JW_BLUE_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW Green",
              "payload": "JW_GREEN_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW White Walker",
              "payload": "JW_WHITE_WALKER_PAYLOAD"
            }
          ]
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
    case "JW_XR_21_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "Firme, balanceado y elegante, tiene notas intrigantes de intensidad que sorprenden y deleitan. Miel dulce y especias con carácter se envuelven en un cálido toque ahumado. Cítricos, frutas tropicales maduras y caramelo entre notas de tabaco y pasas. ¿Quieres saber más de otro whisky?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Sí",
              "payload": "JW_XR_21_SI_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "No",
              "payload": "JW_XR_21_NO_PAYLOAD"
            }
          ]
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
    case "JW_GREEN_NO_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "No hay problema, estoy seguro que encontrarás el regalo perfecto. Keep Walking."
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
    case "JW_GREEN_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "En Johnnie Walker Green Label se pueden percibir intensos aromas herbales y frutales, madera ahumada, pimienta, y delicadas notas de vainilla, con la profundidad que no se puede conseguir en una sola malta. ¿Quieres saber más de otro whisky?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Sí",
              "payload": "JW_GREEN_SI_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "No",
              "payload": "JW_GREEN_NO_PAYLOAD"
            }
          ]
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
    case "SOTANO_SI_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "¿En qué whisky estás interesado?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "JW Gold",
              "payload": "JW_GOLD_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW 18 años",
              "payload": "JW_18_ANNOS_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW XR 21 años",
              "payload": "JW_XR_21_ANNOS_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW Blue",
              "payload": "JW_BLUE_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "JW Green",
              "payload": "JW_GREEN_PAYLOAD"
            }
          ]
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
    case "SOTANO_PAYLOAD":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "text": "Sube por la escalera y dirígete al centro del Nivel 2, te ayudaré a escoger el regalo perfecto. ¿Estás pensando en algún whisky en especial?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Sí",
              "payload": "SOTANO_SI_PAYLOAD"
            },
            {
              "content_type": "text",
              "title": "No",
              "payload": "SOTANO_NO_PAYLOAD"
            }
          ]
        }
      }
      senderActions(senderId);
      callSendApi(messageData);
    break;
    case "EMPEZAR":
      messageData = {
        "recipient": {
          "id": senderId
        },
        "message": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [
                {
                  "title": "Hola, soy Johnnie Walker ¿Estás en Real Plaza Salaverry?",
                  "image_url": "https://i.ebayimg.com/images/g/pi0AAOSwtnpXoB-A/s-l300.jpg",
                  "buttons":[
                    {
                      "type": "postback",
                      "title": "SÍ",
                      "payload": "SI_PAYLOAD"
                    },
                    {
                      "type": "postback",
                      "title": "No",
                      "payload": "NO_PAYLOAD"
                    }
                  ]
                }
              ]
            }
          }
        }
      }
      // messageData = {
      //   "recipient": {
      //     "id": senderId
      //   },
      //   "message": {
      //     "text": "Hola, soy Johnnie Walker ¿Estás en Real Plaza Salaverry?",
      //     "quick_replies": [
      //       {
      //         "content_type": "text",
      //         "title": "SÍ",
      //         "payload": "SI_PAYLOAD"
      //       },
      //       {
      //         "content_type": "text",
      //         "title": "No",
      //         "payload": "NO_PAYLOAD"
      //       }
      //     ]
      //   }
      // }
      senderActions(senderId);
      callSendApi(messageData);
    break;
  }



}

function handlePostback(senderId, payload,event){
  switch (payload) {
    case "GET_STARTED_PRUEBASMG":
      // console.log(payload);
      // podemos enviar un mensaje predeterminado una vez que presionamos en EMPEZAR
      defaultMessage(senderId);
    break;
    case "OPCION1_PAYLOAD":
      showGallery(senderId);
    break;
    case "SI_PAYLOAD":
      handleMessageButtom(senderId,event);
    break;
    case "NO_PAYLOAD":
      handleMessageButtom(senderId,event);
    break;
  }
}

function senderActions(senderId){
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "sender_action": "typing_on"
  }
  callSendApi(messageData);
}

function handleAttachments(senderId,event){
  let attachment_type = event.attachments[0].type;
  switch (attachment_type) {
    case "image":
      // console.log(attachment_type)
    break;
    case "video":
      // console.log(attachment_type)
    break;
    case "audio":
      // console.log(attachment_type)
    break;
    case "file":
      // console.log(attachment_type)
    break;
  }
}


function handleMessage(senderId, event){
  if(event.text){
    // console.log("kalin");
    // console.log(event);
    defaultMessage(senderId,event);
  }else if (event.attachments){
    handleAttachments(senderId, event);
  }
}

function handleMessageTest(event){
  // console.log(event);
  const senderId = event.sender.id;
  const messageText = event.message.text;
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: messageText
    }
  }
  // Le pasamos los mensajes a nuestro bot
  callSendApi(messageData);
}


function callSendApi(response){
  // va hacer el cord de nuestra aplaicacon cuando necesitemos enviar mensajes y presentarlo dentro de nuestro bot
  // con request podremos enviar esta informacion a nuestro bot
  // Le pasamos la api a la cual nos vamos a conectar
  request(
    {
      "url": "https://graph.facebook.com/me/messages/",
      "qs": {
        "access_token": access_token
      },
      "method": "POST",
      "json": response
    },
    function(err){
      if (err) {
        // console.log("Ha ocurrido un error");
      }else{
        // console.log("mensaje enviado");
      }
    }
  );
}

function showGallery(senderId){
  const messageData = {
    "recipient": {
      "id": senderId
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": "Foto 1",
              "subtitle": "Esta es la foto numero 1",
              "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdwF41IGzLjJI1sCGIAOJjbWypn3cIEfyHvnQttRlZhW8ZVukVXA",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Elegir Foto 1",
                  "payload": "FOTO1BTN_PAYLOAD"
                }
              ]
            },
            {
              "title": "Foto 2",
              "subtitle": "Esta es la foto numero 2",
              "image_url": "http://3.bp.blogspot.com/-UbGYWyZhH2I/TcX1OKA_z9I/AAAAAAAAAB4/7EEhhjfztE8/s1600/Code_Geass_wallpaper_by_0shane0amy.jpg",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Elegir Foto 2",
                  "type": "web_url",
                  "url": "https://google.com",
                  "webview_height_ratio": "full"
                }
              ]
            }
          ]
        }
      }
    }
  }
  callSendApi(messageData);
}


// Una funcion para indicar si esta funcionando o no nuestra aplicacion

app.listen(app.get('port'), function(){
  // console.log('nuestro servidor esta funcionando en el puerto: ' + app.get('port'))
});
