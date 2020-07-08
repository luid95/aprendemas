const { Schema, model } = require('mongoose');
//extraemos una propiedad de mongoose
//model: nos sirve para interactuar con la base de datos

const taskSchema = new Schema({
    name: String,
    topic: String,
    description: String,
    video: String,
    files: String,
    date: {
        type: Date,
        default: new Date()
    },
    //campo especial que hara referencia a otro objeto(modelo)
    subject: {type: Schema.ObjectId, ref: 'Subject'}
    
})

module.exports = model('Task', taskSchema);