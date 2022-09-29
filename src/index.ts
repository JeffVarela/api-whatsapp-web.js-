const express = require('express');
const cors = require('cors');
/* configuración de whatsapp */
const qrcode = require("qrcode-terminal");
const { Client, LegacySessionAuth, LocalAuth  } = require("whatsapp-web.js");

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, ()=>{
   console.log('server on port 3000!');
});

// Environment variables
/* const country_code = "505";
const number = process.env.NUMBER;
const msg = "Prueba de mensaje con whatsapp-web.js"; */

// Load the session data if it has been previously saved
/* let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData,
}); */

const client = new Client({
    authStrategy: new LocalAuth({
         clientId: "client-one" //Un identificador(Sugiero que no lo modifiques)
    })
})

// Save session values to the file upon successful auth
client.on('authenticated', (session: any) => {
   //NO ES NECESARIO PERO SI QUIERES AGREGAS UN console.log
   //sessionData = session;
   //fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
   //    if (err) {
   //        console.error(err);
   //    }
   //});
});

client.initialize();

client.on("qr", (qr: any) => {
    qrcode.generate(qr, { small: true });
});

// Save session values to the file upon successful auth
/* client.on("authenticated", (session: any) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err: any) {
        if (err) {
            console.error("ha ocurrido un error: ", err);
        }
    });
}); */

client.on("auth_failure", (msg: any) => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
})


client.on("ready", () => {
    console.log("Client whatsapp is ready!");

    /* setTimeout(() => {
      let chatId = `${country_code}${number}@c.us`;
        client.sendMessage(chatId, msg).then((response: { id: { fromMe: any; }; }) => {
            if (response.id.fromMe) {
                console.log("It works!");
            }
        })
    }, 5000); */
});

app.post('/send_whatsapp', (req: any, res: any) =>{
   const country_code = req.body.code;
   const number = req.body.number;
   const msg = req.body.msg;

//    client.on("ready", () => {
    // console.log("Client is ready!");

    setTimeout(() => {
      let chatId = `${country_code}${number}@c.us`;
        client.sendMessage(chatId, msg).then((response: { id: { fromMe: any; }; }) => {
            if (response.id.fromMe) {
                console.log("mensaje enviado!");
                return res.json("mensaje enviado");
            }else{
                console.log("error al enviar el mensaje.");
                return res.json("error al enviar el mensaje");
            }
        })
    }, 3000);
// });
   
});