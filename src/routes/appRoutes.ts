import { Router } from "express";
import appController from "../controllers/appController";
import jwt from 'jsonwebtoken';

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

     public router: Router = Router();

     constructor() {
          this.config();
     }

     config(): void {
          this.router.get('/list-planes', appController.listPlanes);
          this.router.post('/send-email',appController.sendEmail);
          // this.router.put('/update-plan',appController.updatePlan);
          this.router.put('/update-plan/:id', appController.updatePlan);
          this.router.post('/signin', appController.signin);
          this.router.get('/get-usuario/:id', appController.getUsuario);
          this.router.put('/update-plan/:id', appController.updateDatosEmpresariales);
     }
}

const appRoutes= new AppRoutes();
export default appRoutes.router;

function verifyToken(req:any,res:any,next:any) {
     console.log(req.headers.authorization)
     //en el header viene el authorization, que es el token, si es undefined es porque no viene nada, o sea, no esta logueado, si viene algo, se tiene que comprobar que es un token valido
     if(!req.headers.authorization){
          //si no viene algo en el authorization
        return res.status(401).send('unauthorized request')
     }
     const token=req.headers.authorization.split(' ')[1]
     //dividimos el req en 2 , por que despues del espacio esta el token como tal
     console.log(token)
     if(token==null){// si el token que viene es nulo, retornamos el mensaje de solicitud no autorizada
          return res.status(401).send('unauthorized request')  
     }
     console.log('error')
     const payload:any=jwt.verify(token,'secretkey')
     //ejemplo de token=  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjE2LCJpYXQiOjE1NzcyOTE4MTB9.mE-duTHebllE1LhYFjDqPVoI21JzBzjAqhqnKfqlO2o
     console.log(payload);//aqui tenemos 2 datos , el id y iat, el id es lo unico importante 
     req.userId=payload._id;
     next()
}