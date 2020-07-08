const express = require('express');
const userController = require('../controllers/User');
//para crear una ruta con express
const router = express.Router();
const md_auth = require('../middlewares/authenticated');


router.get('/pruebas', md_auth.ensureAuth , userController.pruebas);
router.post('/register', userController.addUser);
router.post('/login', userController.loginUser);


module.exports = router;
