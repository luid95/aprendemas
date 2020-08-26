'use strict'
const express = require('express');
const userController = require('../controllers/User');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './src/uploads/users');
    },
    filename(req, file = {}, cb) {
      const { originalname } = file;
      
      const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
      // cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`);
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + fileExtension);
      });
    },
  });
var mul_upload = multer({dest: 'src/uploads/users',storage});

router.get('/pruebas',md_auth.ensureAuth, userController.pruebas);
router.post('/register', userController.addUser);
router.post('/login', userController.loginUser);
router.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);//necesitamos la autenticacion para validar la actualizacion
router.post('/upload-image-user/:id', [md_auth.ensureAuth, mul_upload.single('image')], userController.uploadImage);//actualizar la imagen del usuario
router.get('/get-image-user/:imageFile', userController.getImageFile);//

module.exports = router;
