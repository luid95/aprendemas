'use strict'
const express = require('express');
const gradeController = require('../controllers/Grade');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './src/uploads/grades' }); //colocamos la ruta destino de la imagenes

router.get('/grade/:id', md_auth.ensureAuth , gradeController.getGrade);
router.post('/grade', md_auth.ensureAuth , gradeController.addGrade);
router.get('/grades/:school?', md_auth.ensureAuth , gradeController.getGrades);
router.put('/grade/:id', md_auth.ensureAuth , gradeController.updateGrade);
router.delete('/grade/:id', md_auth.ensureAuth , gradeController.deleteGrade);
router.post('/upload-image-grade/:id', [md_auth.ensureAuth, md_upload], gradeController.uploadImage);//actualizar la imagen del usuario
router.get('/get-image-grade/:imageFile', gradeController.getImageFile);//


module.exports = router;