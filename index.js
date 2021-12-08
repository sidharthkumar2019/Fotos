const express = require('express');
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT || 3000;
const server = app.listen(port, ()=> console.log(`listening to port ${port}...`));

const db = "mongodb://localhost:27017/fotos";
mongoose.connect(db)
    .then(()=>console.log(`connected to ${db}`));

const home = require('./routes/home');    
const categories = require('./routes/categories');
const users = require('./routes/users');

app.set('view engine', 'pug');
app.set('views', './views');   
app.use(express.json());
app.use('/', home);    
app.use('/api/categories', categories);
app.use('/api/users',users);

module.exports = server;