'use strict'
const express = require('express');
const schoolController = require('../controllers/School');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './src/uploads/schools' }); //colocamos la ruta destino de la imagenes

router.get('/school/:id', md_auth.ensureAuth , schoolController.getSchool);
router.post('/school', md_auth.ensureAuth , schoolController.addSchool);
router.get('/schools/:page?', md_auth.ensureAuth , schoolController.getSchools);
router.put('/school/:id', md_auth.ensureAuth , schoolController.updateSchool);
router.delete('/school/:id', md_auth.ensureAuth , schoolController.deleteSchool);
router.post('/upload-image-school/:id', [md_auth.ensureAuth, md_upload], schoolController.uploadImage);//actualizar la imagen del usuario
router.get('/get-image-school/:imageFile', schoolController.getImageFile);//


module.exports = router;