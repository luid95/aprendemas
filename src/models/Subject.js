'use strict'

const { Schema, model } = require('mongoose');
//extraemos una propiedad de mongoose
//model: nos sirve para interactuar con la base de datos

const subjectSchema = new Schema({
    name: String,
    image: String,
    date: {
        type: Date,
        default: new Date()
    },
    //campo especial que hara referencia a otro objeto(modelo)
    grade: {type: Schema.ObjectId, ref: 'Grade'}
    
})

module.exports = model('Subject', subjectSchema);