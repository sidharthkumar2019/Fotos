const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000;
const server = app.listen(port, ()=> console.log(`listening to port ${port}...`));

const db = "mongodb://localhost:27017/fotos";
mongoose.connect(db)
    .then(()=>console.log(`connected to ${db}`));

const home = require('./routes/home');    
const categories = require('./routes/categories');
const users = require('./routes/users');
const authenticate = require('./routes/authenticate');
const images = require('./routes/images');

app.set('view engine', 'ejs');
app.set('views', './views');   
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', home);    
app.use('/api/categories', categories);
app.use('/api/users',users);
app.use('/api/authenticate', authenticate);
app.use('/api/images', images);
app.use('/uploads', express.static('uploads'));

module.exports = server;