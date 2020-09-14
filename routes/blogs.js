const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//load helpers 
const {ensureAuthenticated} = require('../helpers/auth');




// load schema
require('../models/Blog');
const Blog = mongoose.model('blogs');

// Blog Index Page
router.get('/', ensureAuthenticated, (req,res) => {
  Blog.find({user: req.user.name}).sort({creationDate:'descending'}).then(blogs => {
    res.render('blogs/index', {
         blogs:blogs
    })
  }) // find something in DB
});

// router for displaying all blogs 
router.get('/allblogs',function(req,res){
  Blog.find({}).then(blogs => {
    res.render('blogs/allblogs',{
     blogs:blogs
    })
  })
});
// url for blogs 
router.get('/read/:title', function(req, res){
  Blog.findOne({
    title: req.params.title
  }).then(blog => {
     res.render('blogs/bloglayout', {
       blog: blog
     });
  
  })
  
});
 


// add blog form
router.get('/add', ensureAuthenticated, (req,res) => {
  res.render('blogs/add'); 
});

// edit blog form
router.get('/edit/:user', ensureAuthenticated, (req,res) => {
  Blog.findOne({
    user: req.params.user
  }).then(blog => {
    if (blog.user != req.user.name) {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/blogs');
    } else {
     res.render('blogs/edit', {
       blog: blog
     });
   }; 
  })
  .catch(err =>{
    req.flash('error_msg', 'Something went wrong !');
    res.redirect('/blogs');
  })
});

// process  form
router.post('/', ensureAuthenticated, (req,res) => {
  let errors = [];
  var subtext =req.body.details.substring(0,90)+".....";
  if (!req.body.title) {
    errors.push({
      text: 'Please add title'
    })
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    })
  }
  
  if (errors.length > 0) {
    res.render('blogs/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
     
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.name,
      subtext : subtext,
      
    };
    new Blog(newUser).save().then(blog => {
      req.flash('success_msg', 'Blog added');
      res.redirect('/blogs');
    })
  }
});

// edit form process
router.put('/:id', ensureAuthenticated, (req,res) => {
Blog.findOne({
    _id: req.params.id
  }).then(blog => {
    // new values
    blog.title = req.body.title;
    blog.details = req.body.details;
    blog.subtext = req.body.details.substring(0,90)+".....";
    blog.save().then( blog => {
      req.flash('success_msg', 'Blog updated');
      res.redirect('/blogs');
    });
  });
});

// delete blog
router.delete('/:id', ensureAuthenticated, (req,res) => {
  Blog.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Blog removed');
    res.redirect('/Blogs');
  })
});



module.exports = router;
