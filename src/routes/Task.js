'use strict'
const express = require('express');
const taskController = require('../controllers/Task');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './src/uploads/taskss');
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
var mul_upload = multer({dest: './src/uploads/taskss',storage});

router.get('/task/:id', md_auth.ensureAuth , taskController.getTask);
router.post('/task', md_auth.ensureAuth , taskController.addTask);
router.get('/tasks/:subject?', taskController.getTasks);
router.put('/task/:id', md_auth.ensureAuth , taskController.updateTask);
router.delete('/task/:id', md_auth.ensureAuth , taskController.deleteTask);
router.post('/upload-file-task/:id', [md_auth.ensureAuth, mul_upload.single('files')], taskController.uploadFile);//actualizar el archivo de la tarea
router.get('/get-task-file/:taskFile', taskController.getTaskFile);//


module.exports = router;