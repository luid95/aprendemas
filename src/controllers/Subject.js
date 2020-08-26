'use strict'

//para poder trabajar con el sistema de fichero
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');//para poder realizar la paginacion

const Subject = require('../models/Subject');//Se carga el modelo
const Task = require('../models/Task');//Se carga el modelo

var ctrlsj = {};

//funcion obtener una materia
ctrlsj.getSubject = (req, res) => {
    
    const subjectId = req.params.id;

    Subject.findById(subjectId).populate({ path: 'grade' }).exec((err, subject) => {

        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{

            if(!subject){
                
                res.status(404).send({message: 'La materia no existe'});
            }else{

                res.status(200).send({ subject });
            }
        }
    });
};

//funcion obtener todos las materias 
ctrlsj.getSubjects = (req, res) => {

    const gradeId = req.params.grade;
    
    if(!gradeId){

        //Obtener todos las materias existentes de la bbdd
        var find = Subject.find({}).sort('name');
    }else{
        
        //Sacar todos las materias existentes de un grado en concreto de la bbdd
        var find = Subject.find({grade: gradeId}).sort('name');
    }

    //populamos los datos del grado dentro las propiedades de materia del documento
    find.populate({ path: 'grade' }).exec((err, subjects) => {

        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{

            if(!subjects){
                
                res.status(404).send({message: 'No hay materias'});
            }else{

                res.status(200).send({ subjects });
            }
        }
    });
};

//funcion guardar una materia
ctrlsj.addSubject = (req, res) => {

    var subject = new Subject();
    
    var params = req.body;
    console.log("params: ", params);
    

    subject.name = params.name;
    subject.image = 'null';
    subject.grade = params.grade;

    subject.save((err, subjectStored) => {

        if(err){
            res.status(500).send({message: 'Error al guardar la materia'});
        }else{

            if(!subjectStored){
                res.status(404).send({message: 'La materia no se ha guardado'});
            }else{
                res.status(200).send({subject: subjectStored});
            }
        }
    });  

};

//funcion que nos permite actualizar una materia
ctrlsj.updateSubject = (req, res) => {

    const subjectId = req.params.id;
    const update = req.body;

    Subject.findByIdAndUpdate(subjectId, update, (err, subjectUpdated) => {

        if(err){
            res.status(500).send({message: 'Error al actualizar la materia'});
        }else{

            if(!subjectUpdated){
                res.status(404).send({message: 'No se ha actualizado la materia'});
            }else{
                res.status(200).send({ subject: subjectUpdated });
            }
        }
    });

};

//funcion eliminar una materia
ctrlsj.deleteSubject = (req, res) => {
    const subjectId = req.params.id;

    //Tambien se eliminaran las materias que tenga asociada el grado
    Subject.findByIdAndRemove(subjectId, (err, subjectRemoved) => {
                    
        if(err){
            res.status(500).send({message: 'Error al eliminar la materia asociada'});
        }else{

            if(!subjectRemoved){
                res.status(404).send({message: 'La materia asociada no han sido eliminada'});
            }else{

                //Tambien se eliminaran las tareas que tenga asociada las materias
                Task.find({subject: subjectRemoved._id}).remove((err, taskRemoved) => {
                    
                    if(err){
                        res.status(500).send({message: 'Error al eliminar las tareas asociados'});
                    }else{
            
                        if(!taskRemoved){
                            res.status(404).send({message: 'Las tareas asociadas no han sido eliminados'});
                        }else{
            
                            //Eliminamos la materia
                            res.status(200).send({ subject: subjectRemoved });
                        }
                    }
                });
            }
        }
    });
};

//funcion para actualizar la imagen del grade
ctrlsj.uploadImage = (req, res) => {
    
    //Obtenemos el id de la materia por medio de la url  con el metodo 'params'
    const subjectId = req.params.id;

    //comprobamos si nuestra variable global files contiene algo
    if(req.file){

        
        const file_path = req.file.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[3]; // para obtener el nombre de la imagen

        //si requerimos el obtener la extension de la imagen 
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jfif'){

            Subject.findByIdAndUpdate(subjectId, { image: file_name }, (err, subjectUpdated) => {

                if(err){
            
                    res.status(500).send({ message: 'Error al actualizar la materia'});
                }else{
        
                    if(!subjectUpdated){
        
                        res.status(404).send({ message: 'No se ha podido actualizar la materia'});
                    }else{

                        //enviamos los datos del usuario que se actualizo
                        res.status(200).send({ subject: subjectUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({ message: 'Extension del archivo no valida'});
        }
        

    }else{

        res.status(200).send({ message: 'No has subido ninguna imagen...'});
    }
};

//funcion obtener la imagen
ctrlsj.getImageFile = (req, res) => {
    
    const imageFile = req.params.imageFile;
    const path_file = './src/uploads/subjects/'+ imageFile;

    fs.exists(path_file, (exists) => {
        if(exists){
            
            res.sendFile(path.resolve(path_file));
        }else{
            
            res.status(200).send({ message: 'No existe la imagen...'});
        }
    });
};

module.exports = ctrlsj;