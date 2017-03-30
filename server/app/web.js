module.exports = (app, passport)=>{

  const webMiddleware = require('./middleware/webMiddleware');
  const apiMiddleware = require('./middleware/apiMiddleware');

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
    // dataDb.run(`CREATE TABLE user_${req.user._id}(time TIMESTAMP default (strftime('%s', 'now')), accel SMALLINT, temp SMALLINT, hum SMALLINT, vbatt SMALLINT)`);
    // homeDb.run(`CREATE TABLE user_${req.user._id}(type VARCHAR NOT NULL, name TEXT, id CHAR(8) NOT NULL, status BOOLEAN NOT NULL, extra TEXT)`);
    res.redirect('/profile');
  });

  app.get('/profile', webMiddleware.loginRedirect, (req,res)=>{
    res.render('profile.ejs', {user: req.user});
  });

  app.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
  });
}
