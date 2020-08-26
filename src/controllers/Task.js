'use strict'

//para poder trabajar con el sistema de fichero
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');//para poder realizar la paginacion

const Task = require('../models/Task');//Se carga el modelo

var ctrlt = {};

//funcion obtener una tarea
ctrlt.getTask = (req, res) => {
    
    const tasktId = req.params.id;

    Task.findById(tasktId).populate({ path: 'subject' }).exec((err, task) => {

        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{

            if(!task){
                
                res.status(404).send({message: 'La tarea no existe'});
            }else{

                res.status(200).send({ task });
            }
        }
    });
};

//funcion obtener todas las tareas 
ctrlt.getTasks = (req, res) => {

    const subjectId = req.params.subject;
    
    if(!subjectId){

        //Obtener todas las tareas existentes de la bbdd
        var find = Task.find({}).sort('topic');
    }else{
        
        //Sacar todas las tareas existentes de una materia en concreto de la bbdd
        var find = Task.find({subject: subjectId}).sort('topic');
    }

    //populamos los datos del grado dentro las propiedades de materia del documento
    find.populate({ 
        path: 'subject',
        populate: {
            path: 'grade',
            model: 'Grade',//obtenemos los datos del grade
            populate: {
                path: 'school',
                model: 'School'//obtenemos los datos de la escuela
            }
        }
        
    }).exec((err, tasks) => {
        
        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{

            if(!tasks){
                
                res.status(404).send({message: 'No hay tareas'});
            }else{

                res.status(200).send({ tasks });
            }
        }
    });
};

//funcion agregar una tarea
ctrlt.addTask = (req, res) => {

    var task = new Task();
    
    var params = req.body;
    console.log("params: ", params);
    

    task.name = params.name;
    task.topic = params.topic;
    task.description = params.description;
    task.video = params.video;
    task.files = 'null';

    task.subject = params.subject;

    task.save((err, taskStored) => {

        if(err){
            res.status(500).send({message: 'Error al guardar la tarea'});
        }else{

            if(!taskStored){
                res.status(404).send({message: 'La tarea no se ha guardado'});
            }else{
                res.status(200).send({task: taskStored});
            }
        }
    });
};

//funcion que nos permite actualizar una tarea
ctrlt.updateTask = (req, res) => {

    const taskId = req.params.id;
    const update = req.body;

    Task.findByIdAndUpdate(taskId, update, (err, taskUpdated) => {

        if(err){
            res.status(500).send({message: 'Error al actualizar la tarea'});
        }else{

            if(!taskUpdated){
                res.status(404).send({message: 'No se ha actualizado la tarea'});
            }else{
                res.status(200).send({ task: taskUpdated });
            }
        }
    });

};

//funcion eliminar una tarea
ctrlt.deleteTask = (req, res) => {
    const taskId = req.params.id;

    //Tambien se eliminaran las materias que tenga asociada el grado
    Task.findByIdAndDelete(taskId, (err, taskDeleted) => {
                    
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{

            if(!taskDeleted){
                res.status(500).send({message: 'No se ha borrado la tarea'});
            }else{
    
                res.status(200).send({task: taskDeleted});
            }
        }
    });
};

//funcion para actualizar la imagen de la tarea
ctrlt.uploadFile = (req, res) => {
    
    //Obtenemos el id de la tarea por medio de la url  con el metodo 'params'
    const taskId = req.params.id;

    //comprobamos si nuestra variable global files contiene algo
    if(req.file){

        
        const file_path = req.file.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[3]; // para obtener el nombre del archivo

        //si requerimos el obtener la extension de la imagen 
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'pdf' || file_ext == 'docx' ){

            Task.findByIdAndUpdate(taskId, { files: file_name }, (err, taskUpdated) => {

                if(err){
            
                    res.status(500).send({ message: 'Error al actualizar la tarea'});
                }else{
        
                    if(!taskUpdated){
        
                        res.status(404).send({ message: 'No se ha podido actualizar la tarea'});
                    }else{

                        //enviamos los datos de la tarea que se actualizo
                        res.status(200).send({ task: taskUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({ message: 'Extension del archivo no valida'});
        }
        

    }else{

        res.status(200).send({ message: 'No has subido ningun archivo...'});
    }
};

//funcion obtener la imagen
ctrlt.getTaskFile = (req, res) => {
    
    const imageFile = req.params.taskFile;
    const path_file = './src/uploads/taskss/'+ imageFile;

    fs.exists(path_file, (exists) => {
        if(exists){
            
            res.sendFile(path.resolve(path_file));
        }else{
            
            res.status(200).send({ message: 'No existe el archivo...'});
        }
    });
};

module.exports = ctrlt;