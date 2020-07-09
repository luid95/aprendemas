'use strict'
const { Schema, model } = require('mongoose');
//extraemos una propiedad de mongoose
//model: nos sirve para interactuar con la base de datos

const schoolSchema = new Schema({
    name: String,
    description: String,
    address: String,
    shift: String,
    image: String,
    date: {
        type: Date,
        default: new Date()
    }
    
})

module.exports = model('School', schoolSchema);