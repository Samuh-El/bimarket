import { Request, Response, Router } from 'express';
import pool from '../database';
import jwt from 'jsonwebtoken'
// const router = Router();
const nodemailer = require('nodemailer')
const fs = require('fs');
class AppController {

     //metodos de practica 

     public async listPlanes(req: Request, res: Response) {
          const data = await pool.query('SELECT * FROM `Planes`');
          res.json(data);
          //   res.json('holaaaa'); 
     }


     public async getInfoCorreos(req: Request, res: Response) {
          const data = await pool.query('SELECT * FROM `Correo` WHERE estado = 0');
          res.json(data);
          //   res.json('holaaaa'); 
     }

     public async updatePlan(req: Request, res: Response): Promise<void> {
          const { idServicio } = req.body;
          console.log(idServicio);
          console.log(req.body);
          await pool.query('UPDATE `Planes` set ? WHERE idServicio = ?', [req.body, req.params.id]);
          console.log('UPDATE `Planes` set ? WHERE idServicio = ?', [req.body, req.params.id])
          res.json(req.body)
     }



     //metodo que se usa cuando se llena el formulario, manda un correo a gerencia con los datos del formulario, y al hacerlo, manda un correo al cliente con un template html de comprobacion de dicha recepcion 
     public sendEmail(req: Request, res: Response) {
          console.log('llego al service nodejs')
          var contentHTML: any;
          var correoDestino: string = 'gerencia@bimarketchile.cl';
          // var correoDestino:string='felipe.ascencio@virginiogomez.cl';
          const { Empresa, RutEmpresa, Website, Direccion, NombreRepLegal, RutRepLegal, Cargo, MailContacto, Telefono, CupoSolicitado, Mensaje } = req.body;
          contentHTML = `
          Solicitud Apertura Cuenta Cliente
          Empresa: ${Empresa}
          Rut Empresa: ${RutEmpresa}
          Website: ${Website} 
          Direccion: ${Direccion}
          Nombre Rep Legal: ${NombreRepLegal}
          Rut Rep Legal: ${RutRepLegal}
          Cargo: ${Cargo}
          Mail Contacto: ${MailContacto}
          Telefono: ${Telefono}
          CupoSolicitado: ${CupoSolicitado}
          Mensaje: ${Mensaje}
         `
          console.log(contentHTML)

          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'noreplyBimarketchile@gmail.com',
                    pass: 'bimaR3344'
               }
          });

          console.log('paso del transporter')

          let mailOptions = {
               from: 'noreplyBimarketchile@gmail.com',
               to: correoDestino,
               subject: 'Solicitud Apertura Cuenta Pyme : ' + Empresa,
               text: contentHTML
          };

          console.log('paso de mailOptions')

          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    res.json({ error: error })
               }


               console.log('el email del cliente es= ' + MailContacto)
               console.log('llego al service nodejs')
               var contentHTML: any;
               var correoDestino: string = MailContacto;

               contentHTML = `<!doctype html>
               <html lang="en">
               <head>
                 <meta charset="utf-8">
                 <title>BI Market Chile</title>
                 <base href="/">
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 <link rel="icon" type="image/x-icon" href="assets/FAVICON.png">
                 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
                 <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
                 <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
                 <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
               
                 <style>
                   .fondo
               {
               background: url('https://pruebas.genbuproducciones.com/Imagenes/fondoCorreo2.png') no-repeat top center fixed;
               -webkit-background-size: cover;
               -moz-background-size: cover;
               -o-background-size: cover;
               background-size: cover;
               min-height: 100vh;
               overflow-x: hidden;
               overflow-y: hidden;
               z-index: 0 !important;
               } 
               
               @media only screen and (min-width:401px) {
          
          .size-p-titulo {
              font-size: 26px !important;
          }

          .size-p {
              font-size: 22px !important;
          }

          .margen-boton {
              margin-top: 50px;
          }

          .alinear-boton {
              text-align: center;
          }

          .width-boton{
              width: 40%;
          }


      }

      @media only screen and (min-width:0px) and (max-width: 400px) {

          .size-p-titulo {
              font-size: 23px !important;
          }

          .size-p {
              font-size: 20px !important;
          }

          .margen-boton {
              margin-top: 50px;
          }

          .alinear-boton {
              text-align: center;
          }

          .width-boton{
              width: 70%;
          }


      }
               </style>
               
               </head>
               
               <body>
                   <div class="fondo p-5" style="color:white;font-size: 2vw;text-align: justify;padding: 30px;">
               
                    <div class="row mb-4">
                        <div class="col-12 col-md-6 col-lg-3">
                            <img width="50%" height="auto" src="https://pruebas.genbuproducciones.com/Imagenes/Logo-blanco.png"
                                alt="">
                            <img style="margin-left:50px" width="28%" height="auto"
                                src="https://pruebas.genbuproducciones.com/Imagenes/1.png" alt="">
                        </div>
            
                    </div>
                       <div class="row">
                           <div class="col-12 col-lg-6 offset-lg-2 mb-4">
                               <p class="size-p-titulo">¡Tu solicitud de apertura de cuenta ha sido cursada!
                               </p> 
                           </div>
                           <div class="col-12 col-lg-10">
                               <span class="size-p">BiMarketChile permite a las pymes financiar, pagar y contratar en línea 
                                   servicios de Marketing, Publicidad, E-Commerce y Transformación Digital.
                                   
                                   </span>
                           </div>
                   
                       </div>
                       
                       <div class="row mt-4">
                           <div class="col-12 col-lg-7">
                               <span class="size-p">Tu respuesta será enviada a tu e-mail dentro de las próximas 72 horas hábiles.
                                   </span>
                           </div>
                       </div>
                       <div class="row mt-2" style="border-top:25px;">
                           <div class="col-12 col-lg-7">
                               <span class="size-p">Gracias por su confianza en BiMarketChile.</span>
                           </div>
                       </div>
               </body>
                
               </html>`


               let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                         user: 'noreplyBimarketchile@gmail.com',
                         pass: 'bimaR3344'
                    }
               });

               let mailOptions = {
                    from: 'noreplyBimarketchile@gmail.com',
                    to: correoDestino,
                    subject: 'Comprobante recepción de formulario por BiMarketChile',
                    html: contentHTML
               };

               transporter.sendMail(mailOptions, (error: any, info: any) => {
                    if (error) {
                         res.json({ error: error })
                    }
                    res.json({ text: 'enviado correctamente' })

               });
          });
     }

     //metodo que envia un correo al cliente una vez haya realizado su compra
     public sendEmailCompratoCliente(req: Request, res: Response) {
          const { idPlan, correo } = req.body;
          console.log('idplan= ' + idPlan)
          console.log('correo= ' + correo)
          // res.json({ error: 'volvi ' })
          // return;
          console.log('llego al service nodejs')
          var contentHTML: any;
          var rutaContrato;

          var correoDestino: string = correo;
console.log('correoDestino= '+correoDestino)
          if (idPlan == 0) {
               rutaContrato = "https://pruebas.genbuproducciones.com/PDF/Contrato%20Plan%20Marketin,%20Branding%20&%20Disen%cc%83o.pdf"
          }

          if (idPlan == 1) {
               rutaContrato = "https://pruebas.genbuproducciones.com/PDF/Contrato%20E-Commerce%20&%20Transformacio%cc%81n.pdf%20Digital.pdf"
          }

          if (idPlan == 2) {
               rutaContrato = "https://pruebas.genbuproducciones.com/PDF/Contrato%20Plan%20Marketin,%20Branding%20&%20Disen%cc%83o.pdf"

          }

          contentHTML = `<!doctype html>
          <html lang="en">
          <head>
              <meta charset="utf-8">
              <title>BI Market Chile</title>
              <base href="/">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <link rel="icon" type="image/x-icon" href="assets/FAVICON.png">
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
                  integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
              <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
                  integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
                  crossorigin="anonymous"></script>
              <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
                  integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
                  crossorigin="anonymous"></script>
              <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
                  integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
                  crossorigin="anonymous"></script>
          
              <style>
                  .fondo {
                      background: url('https://pruebas.genbuproducciones.com/Imagenes/imagenCorreo.png') no-repeat top center fixed;
                      -webkit-background-size: cover;
                      -moz-background-size: cover;
                      -o-background-size: cover;
                      background-size: cover;
                      min-height: 100vh;
                      overflow-x: hidden;
                      overflow-y: hidden;
                      z-index: 0 !important;
                  }
          
                  /* Extra small devices (phones, 600px and down) */
                  @media only screen and (min-width:401px) {
          
                      .size-p-titulo {
                          font-size: 26px !important;
                      }
          
                      .size-p {
                          font-size: 22px !important;
                      }
          
                      .margen-boton {
                          margin-top: 50px;
                      }
          
                      .alinear-boton {
                          text-align: center;
                      }
          
                      .width-boton{
                          width: 40%;
                      }
          
          
                  }
          
                  @media only screen and (min-width:0px) and (max-width: 400px) {
          
                      .size-p-titulo {
                          font-size: 23px !important;
                      }
          
                      .size-p {
                          font-size: 20px !important;
                      }
          
                      .margen-boton {
                          margin-top: 50px;
                      }
          
                      .alinear-boton {
                          text-align: center;
                      }
          
                      .width-boton{
                          width: 70%;
                      }
          
          
                  }
              </style>
          
          </head>
          
          <body>
              <div class="fondo p-5" style="color:white;font-size: 2vw;padding: 30px;">
          
                  <div class="row mb-4">
                      <div class="col-12 col-md-6 col-lg-3">
                          <img width="50%" height="auto" src="https://pruebas.genbuproducciones.com/Imagenes/Logo-blanco.png"
                              alt="">
                          <img style="margin-left:50px" width="28%" height="auto"
                              src="https://pruebas.genbuproducciones.com/Imagenes/1.png" alt="">
                      </div>
          
                  </div>
                  <div class="row mt-5">
                      <div class="col-12 col-lg-6 offset-lg-2 mb-4">
                          <p class="size-p-titulo"><span style="font-weight: bold;">Bienvenidos</span> al Mundo de Servicios <span
                                  style="font-weight: bold;">BiMarketChile</span>
                          </p>
                      </div>
                      <div class="col-12 col-lg-10" style="text-align: justify">
                          <span class="size-p">Recibirás tu contrato personalizado en este mail en 72 horas hábiles <br>
                              Tu Cuenta Empresa BiMarketChile, te permite contratar y financiar linea de Servicios en Marketing,
                              E-Commerce y Transformación Digital.
                          </span>
                      </div>
          
                  </div>
          
                  <div class="row mt-4" style="margin-top: 20px;text-align: justify">
                      <div class="col-12 col-lg-7">
                          <span class="size-p">Estamos siempre disponibles, comunícate con nosotros a</span>
                      </div>
                  </div>
                  <div class="row mt-4" style="margin-top: 20px;text-align: justify">
                      <div class="col-12 col-lg-7">
                          <span class="size-p"><a style="color: white;">gerencia@bimarketchile.cl</a></span>
                      </div>
                  </div>
                  <div class="row mt-4" style="margin-top: 20px;text-align: justify">
                      <div class="col-12 col-lg-7">
                          <span class="size-p">Telefono +56972186190</span>
                      </div>
                  </div>
                  <div class="row mt-4" style="margin-top: 20px;text-align: justify">
                      <div class="col-12 col-lg-7">
                          <span class="size-p">Solicita tus servicios de Marketing, E-Commerce y Transformación Digital
                              Aquí</span>
                      </div>
                  </div>
                  <div class="row mt-4" style="text-align: center;margin-top: 20px;">
                      <div class="col-12 col-lg-7">
                          <a href="http://bimarketchile.cl/docs/Solicitud_Servicios_BimarketChile.docx"><button
                                  class="btn btn-danger width-boton"
                                  style="padding: 10px;color: white;background-color: #DC351F;font-weight: bold;border:0;">Solicitud
                                  de Servicios Aquí</button></a>
                      </div>
                  </div>
                  <div class="row mt-4" style="text-align: center;margin-top: 20px;">
                      <div class="col-12 col-lg-7">
                          <a href="`+rutaContrato+`"><button class="btn btn-danger width-boton"
                                  style="padding: 10px;color: white;background-color: #DC351F;font-weight: bold;border:0;">Contrato
                                  Anual</button></a>
                      </div>
                  </div>
          </body>
          
          </html>`

          // console.log(contentHTML)
         

          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'noreplyBimarketchile@gmail.com',
                    pass: 'bimaR3344'
               }
          });

          console.log('antes del transporter')

          let mailOptions = {
               from: 'noreplyBimarketchile@gmail.com',
               to: correoDestino,
               subject: 'Comprobante de compra de plan',
               html: contentHTML
          };


          console.log('despues de transporter')
          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    console.log('error en transporter')
                    res.json({ error: error })
               }
               console.log('paso el transporter')
               var x='bien'
               res.json('enviado correctamente')
          });
     }



     public async deleteEmailInDb(req: Request, res: Response): Promise<void> {
          const  id  = req.params.id;
          console.log(id);
          console.log(req.body);
          await pool.query('UPDATE `Correo` set estado = 1 WHERE id = ?', [req.params.id]);
          console.log('UPDATE `Planes` set ? WHERE id = ?', [req.body, req.params.id])
          res.json(req.body)
     }



     //este metodo no se usa, va todo en el metodo anterior
     public sendEmailCliente(emailCliente: any, res: Response) {
          console.log('el email del cliente es= ' + emailCliente)
          console.log('llego al service nodejs')
          var contentHTML: any;
          var correoDestino: string = emailCliente;
          var data = require('../../respuestaFormulario.html');
          console.log('la data es= ' + data)

          contentHTML = data
          console.log(contentHTML)

          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'noReplyNodo@gmail.com',
                    pass: 'soyunaprueba'
               }
          });

          let mailOptions = {
               from: 'noReplyNodo@gmail.com',
               to: correoDestino,
               subject: 'Comprobante recepción de su formulario..',
               html: contentHTML
          };

          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    res.json({ error: error })
               }
               res.json({ text: 'enviado correctamente' })

          });
     }


     public async signin(req: any, res: any): Promise<void> {
          const { name, password } = req.body;
          console.log(name)
          console.log(password)

          var Admin = {
               idUsuario: -1,
          }

          console.log("consulta a la db por correo y password")
          const admin = await pool.query('SELECT idUsuario FROM `Usuario` WHERE nombreUsuario=\'' + name + '\' AND claveUsuario=\'' + password + '\'')
          if (admin.length > 0) {

               Admin = admin[0]
               console.log('admin Admin= ' + Admin)
               console.log('admin id= ' + Admin.idUsuario)

               const token = jwt.sign({ _id: Admin.idUsuario }, 'secretkey')
               return res.status(200).json({ Admin, token })
          } else {
               //res.json({message:'password incorrecta'});
               return res.status(401).send("correo o contraseña incorrecta")
          }
     }

     //obtener usuario-administrador en panel, retorna los datos del usuario y el nombre de la pyme asociada, requiere el id del usuario
     public async getUsuario(req: Request, res: Response): Promise<any> {

          console.log('getusuario metodo en node')

          const usuario = await pool.query('SELECT u.NombreUsuario,u.ApellidoUsuario,u.celular,u.correo,u.direccion,p.nombrePyme FROM `usuario-administrador` AS u INNER JOIN `pyme` AS p ON u.Pyme_idPyme = p.idPyme where u.idUsuario = ?', [req.params.id]);
          console.log('usuario= ' + usuario)

          if (usuario.length > 0) {
               return res.json(usuario[0]);
          }
          return res.json({ text: "usuario no existe en db" })
     }

}

const appController = new AppController();
export default appController;