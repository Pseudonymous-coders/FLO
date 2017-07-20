module.exports = (app, passport)=>{

  const webMiddleware = require('./middleware/webMiddleware');
  const apiMiddleware = require('./middleware/apiMiddleware');
  const sqlite = require('sqlite3');

  app.use(webMiddleware.setLoginStatus, (req,res,next)=>{
    res.locals = {
      user: res.user || undefined
    };
    next();
  });

  app.get('/', (req,res)=>{
    res.render('index.ejs', {
      user: req.user,
    });
  });

  app.get('/login', (req,res)=>{
    res.render('login.ejs', {message: req.flash('loginMessage')});
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  }));

  app.get('/signup', (req,res)=>{
    res.render('signup.ejs', {message: req.flash('signupMessage')});
  });

  app.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: "/signup",
    failureFlash: true
  }), (req,res)=>{
    res.redirect('/profile');
  });

  app.get('/profile', webMiddleware.loginRedirect, (req,res)=>{
    res.render('profile.ejs', {user: req.user});
  });

  app.get('/add', webMiddleware.loginRedirect, (req,res)=>{
    // THIS NEEDS WORK

    // let db = new sqlite.Database('students.db');
    // db.each('SELECT lname, fname, id WHERE ');
    // db.close()
    // res.render('add.ejs', {user: req.user, students: })
  });

  app.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
  });
}
