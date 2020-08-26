'use strict'
const express = require('express');
const schoolController = require('../controllers/School');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './src/uploads/schools');
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
var mul_upload = multer({dest: './src/uploads/schools',storage});

router.get('/school/:id', md_auth.ensureAuth, schoolController.getSchool);
router.post('/school', md_auth.ensureAuth, schoolController.addSchool);
router.get('/schools/:page?', md_auth.ensureAuth, schoolController.getSchools);
router.put('/school/:id', md_auth.ensureAuth, schoolController.updateSchool);
router.delete('/school/:id', md_auth.ensureAuth, schoolController.deleteSchool);
router.post('/upload-image-school/:id', [md_auth.ensureAuth, mul_upload.single('image')], schoolController.uploadImage);//actualizar la imagen del usuario
router.get('/get-image-school/:imageFile', schoolController.getImageFile);//


module.exports = router;