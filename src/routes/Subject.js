'use strict'
const express = require('express');
const subjectController = require('../controllers/Subject');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './src/uploads/subjects');
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
var mul_upload = multer({dest: './src/uploads/subjects',storage});

router.get('/subject/:id', md_auth.ensureAuth , subjectController.getSubject);
router.post('/subject', md_auth.ensureAuth , subjectController.addSubject);
router.get('/subjects/:grade?', md_auth.ensureAuth , subjectController.getSubjects);
router.put('/subject/:id', md_auth.ensureAuth , subjectController.updateSubject);
router.delete('/subject/:id', md_auth.ensureAuth , subjectController.deleteSubject);
router.post('/upload-image-subject/:id', [md_auth.ensureAuth, mul_upload.single('image')], subjectController.uploadImage);//actualizar la imagen del usuario
router.get('/get-image-subject/:imageFile', subjectController.getImageFile);//


module.exports = router;