'use strict'
const express = require('express');
const userController = require('../controllers/User');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './src/uploads/users' }); //colocamos la ruta destino de la imagenes


router.get('/pruebas', md_auth.ensureAuth , userController.pruebas);
router.post('/register', userController.addUser);
router.post('/login', userController.loginUser);
router.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);//necesitamos la autenticacion para validar la actualizacion
router.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);//actualizar la imagen del usuario
router.get('/get-image-user/:imageFile', userController.getImageFile);//

module.exports = router;
