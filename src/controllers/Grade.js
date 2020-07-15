'use strict'

//para poder trabajar con el sistema de fichero
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');//para poder realizar la paginacion

const Grade = require('../models/Grade');//Se carga el modelo
const Subject = require('../models/Subject');//Se carga el modelo
const Task = require('../models/Task');//Se carga el modelo

var ctrlg = {};

//funcion obtener un grado
ctrlg.getGrade = (req, res) => {
    
    const gradeId = req.params.id;

    Grade.findById(gradeId).populate({ path: 'school' }).exec((err, grade) => {

        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{

            if(!grade){
                
                res.status(404).send({message: 'El grado no existe'});
            }else{

                res.status(200).send({ grade });
            }
        }
    }) ;
};

//funcion obtener todos los grados
ctrlg.getGrades = (req, res) => {

    const schoolId = req.params.school;
    
    if(!schoolId){

        //Obtener todos los grados existentes de la bbdd
        var find = Grade.find({}).sort('grade');
    }else{
        
        //Sacar todos los grados existentes de una escuela concreto de la bbdd
        var find = Grade.find({school: schoolId}).sort('grade');
    }
    
    //populamos los datos de la escuela dentro las propiedades de grade del documento
    find.populate({ path: 'school' }).exec((err, grades) => {

        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{

            if(!grades){
                
                res.status(404).send({message: 'No hay grados'});
            }else{

                res.status(200).send({ grades });
            }
        }
    });
};

//funcion que nos permite crear un grade
ctrlg.addGrade = (req, res) => {
    var grade = new Grade();
    
    var params = req.body;
    console.log("params: ", params);
    

    grade.grade = params.grade;
    grade.group = params.group;
    grade.image = 'null';
    grade.school = params.school;

    grade.save((err, gradeStored) => {

        if(err){
            res.status(500).send({message: 'Error al guardar el grado'});
        }else{

            if(!gradeStored){
                res.status(404).send({message: 'El grado no se ha guardado'});
            }else{
                res.status(200).send({grade: gradeStored});
            }
        }
    });
    
};

//funcion que nos permite actualizar un grade
ctrlg.updateGrade = (req, res) => {

    const gradeId = req.params.id;
    const update = req.body;

    Grade.findByIdAndUpdate(gradeId, update, (err, gradeUpdated) => {

        if(err){
            res.status(500).send({message: 'Error al actualizar el grado'});
        }else{

            if(!gradeUpdated){
                res.status(404).send({message: 'No se ha actualizado el grado'});
            }else{
                res.status(200).send({ grade: gradeUpdated });
            }
        }
    });

};

//funcion eliminar un grade
ctrlg.deleteGrade = (req, res) => {

    const gradeId = req.params.id;
    
    //Tambien se eliminaran los grados que tenga asociada la escuela
    Grade.findByIdAndRemove(gradeId, (err, gradeRemoved) => {

        if(err){
            res.status(500).send({message: 'Error al eliminar el grado'});
        }else{

            if(!gradeRemoved){
                res.status(404).send({message: 'El grado asociado no ha sido eliminado'});
            }else{

                //Tambien se eliminaran las materias que tenga asociada el grado
                Subject.find({grade: gradeRemoved._id}).remove((err, subjectRemoved) => {
                    
                    if(err){
                        res.status(500).send({message: 'Error al eliminar las materias asociadas'});
                    }else{
            
                        if(!subjectRemoved){
                            res.status(404).send({message: 'Las materias asociadas no han sido eliminados'});
                        }else{
            
                            //Tambien se eliminaran las tareas que tenga asociada las materias
                            Task.find({subject: subjectRemoved._id}).remove((err, taskRemoved) => {
                                
                                if(err){
                                    res.status(500).send({message: 'Error al eliminar las tareas asociados'});
                                }else{
                        
                                    if(!taskRemoved){
                                        res.status(404).send({message: 'Las tareas asociadas no han sido eliminados'});
                                    }else{
                        
                                        //Eliminamos la escuela
                                        res.status(200).send({ grade: gradeRemoved });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};

//funcion para actualizar la imagen del grade
ctrlg.uploadImage = (req, res) => {
    
    //Obtenemos el id del grade por medio de la url  con el metodo 'params'
    const gradeId = req.params.id;

    //comprobamos si nuestra variable global files contiene algo
    if(req.files){

        
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[3]; // para obtener el nombre de la imagen

        //si requerimos el obtener la extension de la imagen 
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Grade.findByIdAndUpdate(gradeId, { image: file_name }, (err, gradeUpdated) => {

                if(err){
            
                    res.status(500).send({ message: 'Error al actualizar el grade'});
                }else{
        
                    if(!gradeUpdated){
        
                        res.status(404).send({ message: 'No se ha podido actualizar el grade'});
                    }else{

                        //enviamos los datos del usuario que se actualizo
                        res.status(200).send({ grade: gradeUpdated});
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
ctrlg.getImageFile = (req, res) => {
    
    const imageFile = req.params.imageFile;
    const path_file = './src/uploads/grades/'+ imageFile;

    fs.exists(path_file, (exists) => {
        if(exists){
            
            res.sendFile(path.resolve(path_file));
        }else{
            
            res.status(200).send({ message: 'No existe la imagen...'});
        }
    });
};

module.exports = ctrlg;