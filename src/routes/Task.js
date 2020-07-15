'use strict'
const express = require('express');
const taskController = require('../controllers/Task');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
//para poder trabajar con la carga de fichero (image for user)
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './src/uploads/taskss' }); //colocamos la ruta destino de la imagenes

router.get('/task/:id', md_auth.ensureAuth , taskController.getTask);
router.post('/task', md_auth.ensureAuth , taskController.addTask);
router.get('/tasks/:subject?', md_auth.ensureAuth , taskController.getTasks);
router.put('/task/:id', md_auth.ensureAuth , taskController.updateTask);
router.delete('/task/:id', md_auth.ensureAuth , taskController.deleteTask);
router.post('/upload-file-task/:id', [md_auth.ensureAuth, md_upload], taskController.uploadFile);//actualizar el archivo de la tarea
router.get('/get-task-file/:taskFile', taskController.getTaskFile);//


module.exports = router;