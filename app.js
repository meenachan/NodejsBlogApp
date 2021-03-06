const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');

// load routes
const blogs = require('./routes/blogs');
const users = require('./routes/users');


// passport config
require('./config/passport')(passport);

// db config
const db = require('./config/database');

// connect to mongoose
mongoose.connect(db.mongoURI,{useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.log(err);
});

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'

}));
app.set('view engine', 'handlebars');

// body parser middleware
// - parse application/x-www-form-urlencoded
// - parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));

// express session
app.use(session({
  secret: 'yo',
  resave: true,
  saveUninitialized: true

}));

// add passport middleware

app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg'); // needed for flash to work
  res.locals.error_msg = req.flash('error_msg');     // needed for flash to work
  res.locals.error = req.flash('error');             // needed for flash to work
  res.locals.user = req.user || null;                // needed for passport login/logout to work
  next();
})

// home page 
app.get('/', (req, res) => {
    const title='Welcome to BlogApp';
    res.render('index', {
       title: title
   });
});

app.get('/contact', (req , res) =>{
  res.render('contact');
})




// use routes
app.use('/users', users);
app.use('/blogs', blogs);

const port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log(`listening on port ${port}`);
});



