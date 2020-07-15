'use strict'

//para poder trabajar con el sistema de fichero
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');//para poder realizar la paginacion

const School = require('../models/School');//Se carga el modelo
const Grade = require('../models/Grade');//Se carga el modelo
const Subject = require('../models/Subject');//Se carga el modelo
const Task = require('../models/Task');//Se carga el modelo

var ctrls = {};

//funcion obtener una escuela
ctrls.getSchool = (req, res) => {
    
    const schoolId = req.params.id;

    School.findById(schoolId, (err, school) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{

            if(!school){
                res.status(404).send({message: 'La escuela no existe'});
            }else{
                res.status(200).send({ school });
            }
        }
    });
};

//funcion obtener todas las escuelas
ctrls.getSchools = (req, res) => {
    
    if(req.params.page){

        var page = req.params.page;
    }else{
        var page = 1;
    }
    
    const itemsPerPage = 3;

    School.find().sort('name').paginate(page, itemsPerPage, (err, schools, total) => {

        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!schools){
                res.status(404).send({message: 'No hay escuelas'});
            }else{
                
                return res.status(200).send({
                    pages: total,
                    schools: schools
                });
            }
        }
    });
};

//funcion que nos permite crear una school
ctrls.addSchool = (req, res) => {
    var school = new School();
    
    var params = req.body;
    console.log("params: ", params);
    

    school.name = params.name;
    school.description = params.description;
    school.address = params.address;
    school.shift = params.shift;
    school.image = 'null';

    school.save((err, schoolStored) => {

        if(err){
            res.status(500).send({message: 'Error al guardar la escuela'});
        }else{

            if(!schoolStored){
                res.status(404).send({message: 'La escuela no ha sido almacenada'});
            }else{
                res.status(200).send({school: schoolStored});
            }
        }
    });
    
};

//funcion actualizar una escuela
ctrls.updateSchool = (req, res) => {
    
    const schoolId = req.params.id;
    const update = req.body;

    School.findByIdAndUpdate(schoolId, update, (err, schoolUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar la escuela'});
        }else{

            if(!schoolUpdated){
                res.status(404).send({message: 'La escuela no ha sido actualizado'});
            }else{
                res.status(200).send({ school: schoolUpdated });
            }
        }
    });
};

//funcion eliminar una escuela
ctrls.deleteSchool = (req, res) => {
    
    const schoolId = req.params.id;

    School.findByIdAndRemove(schoolId, (err, schoolRemoved) => {

        if(err){
            res.status(500).send({message: 'Error al actualizar la escuela'});
        }else{

            if(!schoolRemoved){
                res.status(404).send({message: 'La escuela no ha sido eliminada'});
            }else{

                //Tambien se eliminaran los grados que tenga asociada la escuela
                Grade.find({school: schoolRemoved._id}).remove((err, gradeRemoved) => {

                    if(err){
                        res.status(500).send({message: 'Error al eliminar los grados asociados'});
                    }else{
            
                        if(!gradeRemoved){
                            res.status(404).send({message: 'Los grados asociados no han sido eliminados'});
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
                                                    res.status(200).send({ schoolRemoved });
                                                }
                                            }
                                        });
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

//funcion para actualizar la imagen de la escuela
ctrls.uploadImage = (req, res) => {
    
    //Obtenemos el id de la escuela por medio de la url  con el metodo 'params'
    const schoolId = req.params.id;

    //comprobamos si nuestra variable global files contiene algo
    if(req.files){

        
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[3]; // para obtener el nombre de la imagen

        //si requerimos el obtener la extension de la imagen 
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            School.findByIdAndUpdate(schoolId, { image: file_name }, (err, schoolUpdated) => {

                if(err){
            
                    res.status(500).send({ message: 'Error al actualizar la escuela'});
                }else{
        
                    if(!schoolUpdated){
        
                        res.status(404).send({ message: 'No se ha podido actualizar la escuela'});
                    }else{

                        //enviamos los datos del usuario que se actualizo
                        res.status(200).send({ school: schoolUpdated});
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

//funcion de prueba
ctrls.getImageFile = (req, res) => {
    
    const imageFile = req.params.imageFile;
    const path_file = './src/uploads/schools/'+ imageFile;

    fs.exists(path_file, (exists) => {
        if(exists){
            
            res.sendFile(path.resolve(path_file));
        }else{
            
            res.status(200).send({ message: 'No existe la imagen...'});
        }
    });
};



module.exports = ctrls;