//1.Dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const passport = require('passport');
const moment = require('moment')
const expressSession = require('express-session')({
  secret: 'jaques',
  resave: false,
  saveUninitialized: false
});

require('dotenv').config();


// import user model
const User = require("./models/User")

//import routes
// const studyRoutes = require("./routes/studyRoutes");
const indexRoutes = require('./routes/indexRoutes');
const chicksRoutes = require('./routes/chicksRoutes');
// const farmersRoutes = require('./routes/farmerRoutes');
// const salesRoutes = require('./routes/salesRoutes');
const authRoutes = require('./routes/authRoutes');
const dashRoutes = require('./routes/dashRoutes');


//2. INITIALIZING EXPRESS APP
const app = express();
const port = 3000;


//3. CONFIGURATIONS
app.locals.moment = moment;
mongoose.connect(process.env.DATABASE)
mongoose.connection
  .once('open', () => {
    console.log('Mongoose connection open!!')
  })
  .on('error', (error) => {
    console.error(`Connection error:${error.message}`)
  });

app.set("view engine", "pug") // setting pug as the view engine 
app.set("views", path.join(__dirname, "views")); // specifying a folder containing front-end files 

//4.MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//express session configs
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

//passport configs
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//5.USE IMPORTED ROUTES 
app.use('/', indexRoutes);
app.use('/', chicksRoutes);
// app.use('/', farmersRoutes);
// app.use('/', salesRoutes);
app.use('/', authRoutes);
app.use('/', dashRoutes);

//for non-existing routes
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Not Found' }); //always above the server

});



//6. Starting the server
app.listen(port, () => console.log
  (`listening on port ${port}`));
