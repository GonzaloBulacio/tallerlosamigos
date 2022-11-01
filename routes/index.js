var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var novedadesModel= require("../models/novedadesModel");
var cloudinary = require("cloudinary").v2;

/* GET home page. */
router.get('/', async function (req, res, next) {
 
  novedades = await novedadesModel.getNovedades();
  novedades = novedades.splice(0, 5);
  novedades = novedades.map(novedad =>{
    if(novedad.img_id){
      const imagen= cloudinary.url(novedad.img_id, {
        width:460,
        crop:"fill"
      });
      return{
        ...novedad,
        imagen
      }
    }else{
      return{
        ...novedad,
        imagen: "/images/noimage.jpg"
      }
    }
  });

  res.render('index',{
    novedades
  });
});

router.post("/", async (req, res, next) => {



  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.tel;
  var mensaje = req.body.mensaje;

  var obj = {
    to: "gonza.bulacio1@gmail.com",
    subject: "Contacto desde la web taller los amigos",
    html: nombre + " " + apellido +" " + " se contacto a traves y quiere mas info a este correo: " +
      email + ". <br> Además, quiere saber se pueden realizar el siguente trabajo: " + mensaje + ".<br> Su tel es " + telefono
  } // cierra var obj


  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    post: process.env.SMTP_POST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  }) // cierre de transporter

  var info = await transporter.sendMail(obj);
  res.render("index", {
    message: "Mensaje enviado correctamenta"
  }); // cierra peticiones del Post
})
  module.exports = router;

