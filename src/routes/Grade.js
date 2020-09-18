'use strict'
const express = require('express');
const gradeController = require('../controllers/Grade');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './src/uploads/grades');
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
var mul_upload = multer({dest: './src/uploads/grades',storage});

router.get('/grade/:id', gradeController.getGrade);
router.post('/grade', md_auth.ensureAuth , gradeController.addGrade);
router.get('/grades/:school?', gradeController.getGrades);
router.put('/grade/:id', md_auth.ensureAuth , gradeController.updateGrade);
router.delete('/grade/:id', md_auth.ensureAuth , gradeController.deleteGrade);
router.post('/upload-image-grade/:id', [md_auth.ensureAuth, mul_upload.single('image')], gradeController.uploadImage);//actualizar la imagen del usuario
router.get('/get-image-grade/:imageFile', gradeController.getImageFile);//


module.exports = router;