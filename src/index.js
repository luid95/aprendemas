'use strict'

var mongoose = require('mongoose'); 
var app = require('./server');

// Le indicamos a Mongoose que haremos la conexión con Promesas
mongoose.Promise = global.Promise;
//connecting to db
//const uri = 'mongodb://127.0.0.1:27017/aprendemas';
const uri = 'mongodb+srv://mongoluis:mongoluis123@cluster0.tmt8h.mongodb.net/aprendemas?retryWrites=true&w=majority';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.catch(err => console.log(err));

mongoose.connection.on('open', _ => {
    console.log('Database is conected to ', uri);

    app.listen(app.get('port'), ()=>{
        console.log("Server on port ", app.get('port'));
        
    })
});