'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/User');
var jwt = require('../services/jwt');

var ctrlu = {};

//funcion de prueba
ctrlu.pruebas = (req, res) => {
    
    res.status(200).send({ message: 'Probando una accion del controlador de user.js'});
};

//funcion que nos permite crear usuario
ctrlu.addUser = (req, res) => {
    var user = new User();
    
    var params = req.body;
    console.log("params: ", params);
    

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //Encriptar la password y guardar los datos
        bcrypt.hash(params.password, null, null, (err, hash) =>{
            user.password = hash;
            console.log(user.password);
            
            if(user.name != null && user.surname != null && user.email != null){
                //Guardar el usuario
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({mesage: 'Error al guardar el usuario'})
                    }else{

                        if(!userStored){
                            res.status(404).send({mesage: 'No se ha registrado el usuario'})
                        }else{
                            res.status(200).send({mesageuser: userStored})
                        }
                    }
                });

            }else{
                res.status(200).send({mesage: 'Rellena todos los campos'})
            }
            
        });
    }else{
        res.status(500).send({mesage: 'Introduce la password'})
    }
    
};

//funcion para loguearse
ctrlu.loginUser = (req, res) => {   
    var params = req.body;
    
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) =>{
        if(err){
            res.status(500).send({mesage: 'Error en la peticion'})
        }else{
            //vamos a comprobar si el usuario existe o no
            if(!user){
                res.status(404).send({mesage: 'El usuario no existe'})
            }else{
                //vamos a comprobar la password
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        //devolver los datos del usuario logueado
                        if(params.gethash){
                            //devolver un token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });

                        }else{
                            res.status(200).send({ user })
                        }

                    }else{
                        res.status(404).send({mesage: 'El usuario no ha podido loguearse'})
                    }
                });
            }
        }
    });
};

//funcion para actualizar datos de un usuario
ctrlu.updateUser = (req, res) => {
    
    //Obtenemos el id del usuario por medio de la url  con el metodo 'params'
    const userId = req.params.id;
    const update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if(err){
            
            res.status(500).send({ message: 'Error al actualizar el usuario'});
        }else{

            if(!userUpdate){

                res.status(404).send({ message: 'No se ha podido actualizar el usuario'});
            }else{
                //enviamos los datos del usuario que se actualizo
                res.status(200).send({ user: userUpdate});
            }
        }
    });

    
};

//funcion de prueba
ctrlu.uploadImage = (req, res) => {
    
    //Obtenemos el id del usuario por medio de la url  con el metodo 'params'
    const userId = req.params.id;

    //comprobamos si nuestra variable global files contiene algo
    if(req.files){

        
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[3]; // para obtener el nombre de la imagen

        //si requerimos el obtener la extension de la imagen 
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {

                if(err){
            
                    res.status(500).send({ message: 'Error al actualizar el usuario'});
                }else{
        
                    if(!userUpdated){
        
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario'});
                    }else{
                        //enviamos los datos del usuario que se actualizo
                        res.status(200).send({ user: userUpdated});
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

module.exports = ctrlu;