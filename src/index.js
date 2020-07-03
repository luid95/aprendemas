'use strict'

const mongoose = require('mongoose'); 
const app = require('./server');

mongoose.Promise = global.Promise;
const uri = 'mongodb://127.0.0.1:27017/aprendemas';

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