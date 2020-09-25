"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appController_1 = __importDefault(require("../controllers/appController"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// var multipart = require('connect-multiparty');
// const multiPartMiddleware=multipart({
//      uploadDir:'./src/solicitud-onePage'
// })
// const multiPartMiddlewareProducto=multipart({
//      uploadDir:'./src/imagenes/productos'
// })
// const multiPartMiddlewareServicio=multipart({
//      uploadDir:'./src/imagenes/servicios'
// })
class AppRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/list-planes', appController_1.default.listPlanes);
        this.router.post('/send-email', appController_1.default.sendEmail);
        this.router.put('/update-plan/:id', appController_1.default.updatePlan);
        this.router.post('/signin', appController_1.default.signin);
        this.router.get('/get-usuario/:id', appController_1.default.getUsuario); 
    }
}
const appRoutes = new AppRoutes();
exports.default = appRoutes.router;
function verifyToken(req, res, next) {
    console.log(req.headers.authorization);
    //en el header viene el authorization, que es el token, si es undefined es porque no viene nada, o sea, no esta logueado, si viene algo, se tiene que comprobar que es un token valido
    if (!req.headers.authorization) {
        //si no viene algo en el authorization
        return res.status(401).send('unauthorized request');
    }
    const token = req.headers.authorization.split(' ')[1];
    //dividimos el req en 2 , por que despues del espacio esta el token como tal
    console.log(token);
    if (token == null) { // si el token que viene es nulo, retornamos el mensaje de solicitud no autorizada
        return res.status(401).send('unauthorized request');
    }
    console.log('error');
    const payload = jsonwebtoken_1.default.verify(token, 'secretkey');
    //ejemplo de token=  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjE2LCJpYXQiOjE1NzcyOTE4MTB9.mE-duTHebllE1LhYFjDqPVoI21JzBzjAqhqnKfqlO2o
    console.log(payload); //aqui tenemos 2 datos , el id y iat, el id es lo unico importante 
    req.userId = payload._id;
    next();
}
