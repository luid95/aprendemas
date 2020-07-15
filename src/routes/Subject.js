'use strict'
const express = require('express');
const subjectController = require('../controllers/Subject');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './src/uploads/subjects' }); //colocamos la ruta destino de la imagenes

router.get('/subject/:id', md_auth.ensureAuth , subjectController.getSubject);
router.post('/subject', md_auth.ensureAuth , subjectController.addSubject);
router.get('/subjects/:grade?', md_auth.ensureAuth , subjectController.getSubjects);
router.put('/subject/:id', md_auth.ensureAuth , subjectController.updateSubject);
router.delete('/subject/:id', md_auth.ensureAuth , subjectController.deleteSubject);
router.post('/upload-image-subject/:id', [md_auth.ensureAuth, md_upload], subjectController.uploadImage);//actualizar la imagen del usuario
router.get('/get-image-subject/:imageFile', subjectController.getImageFile);//


module.exports = router;