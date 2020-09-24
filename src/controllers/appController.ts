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

     public async updatePlan(req: Request, res: Response): Promise<void> {
          const { idServicio } = req.body;
          console.log(idServicio);
          console.log(req.body);
          await pool.query('UPDATE `Planes` set ? WHERE idServicio = ?', [req.body, req.params.id]);
          console.log('UPDATE `Planes` set ? WHERE idServicio = ?', [req.body, req.params.id])
          res.json(req.body)
     }




     public sendEmail(req: Request, res: Response) {
          console.log('llego al service nodejs')
          var contentHTML: any;
          var correoDestino:string='gerencia@bimarketchile.cl';
          const { Empresa, RutEmpresa, Website,Direccion,NombreRepLegal,RutRepLegal,Cargo,MailContacto,Telefono,CupoSolicitado,Mensaje } = req.body;
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
                    user: 'noReplyNodo@gmail.com',
                    pass: 'soyunaprueba'
               }
          });

          let mailOptions = {
               from: 'noReplyNodo@gmail.com',
               to: correoDestino,
               subject: 'Solicitud Apertura Cuenta Pyme Empresa : ' + Empresa,
               text: contentHTML  
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