"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const router = Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
class AppController {
    //metodos de practica
    listPlanes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default.query('SELECT * FROM `Planes`');
            res.json(data);
            //   res.json('holaaaa'); 
        });
    }
    updatePlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idServicio } = req.body;
            console.log(idServicio);
            console.log(req.body);
            yield database_1.default.query('UPDATE `Planes` set ? WHERE idServicio = ?', [req.body, req.params.id]);
            console.log('UPDATE `Planes` set ? WHERE idServicio = ?', [req.body, req.params.id]);
            res.json(req.body);
        });
    }
    sendEmail(req, res) {
        console.log('llego al service nodejs');
        var contentHTML;
        var correoDestino = 'gerencia@bimarketchile.cl';
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
         `;
        console.log(contentHTML);
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
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.json({ error: error });
            }
            res.json({ text: 'enviado correctamente' });
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, password } = req.body;
            console.log(name);
            console.log(password);
            var Admin = {
                idUsuario: -1,
            };
            console.log("consulta a la db por correo y password");
            const admin = yield database_1.default.query('SELECT idUsuario FROM `Usuario` WHERE nombreUsuario=\'' + name + '\' AND claveUsuario=\'' + password + '\'');
            if (admin.length > 0) {
                Admin = admin[0];
                console.log('admin Admin= ' + Admin);
                console.log('admin id= ' + Admin.idUsuario);
                const token = jsonwebtoken_1.default.sign({ _id: Admin.idUsuario }, 'secretkey');
                return res.status(200).json({ Admin, token });
            }
            else {
                //res.json({message:'password incorrecta'});
                return res.status(401).send("correo o contraseña incorrecta");
            }
        });
    }
    //obtener usuario-administrador en panel, retorna los datos del usuario y el nombre de la pyme asociada, requiere el id del usuario
    getUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getusuario metodo en node');
            const usuario = yield database_1.default.query('SELECT u.NombreUsuario,u.ApellidoUsuario,u.celular,u.correo,u.direccion,p.nombrePyme FROM `usuario-administrador` AS u INNER JOIN `pyme` AS p ON u.Pyme_idPyme = p.idPyme where u.idUsuario = ?', [req.params.id]);
            console.log('usuario= ' + usuario);
            if (usuario.length > 0) {
                return res.json(usuario[0]);
            }
            return res.json({ text: "usuario no existe en db" });
        });
    }
}
const appController = new AppController();
exports.default = appController;
