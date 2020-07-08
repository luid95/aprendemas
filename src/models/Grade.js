const { Schema, model } = require('mongoose');
//extraemos una propiedad de mongoose
//model: nos sirve para interactuar con la base de datos

const gradeSchema = new Schema({
    grade: String,
    group: String,
    image: String,
    date: {
        type: Date,
        default: new Date()
    },
    //campo especial que hara referencia a otro objeto(modelo)
    school: {type: Schema.ObjectId, ref: 'School'}
    
})

module.exports = model('Grade', gradeSchema);