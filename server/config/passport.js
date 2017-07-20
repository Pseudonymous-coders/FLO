const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

module.exports = (passport)=>{
  passport.serializeUser((user,done)=>{
    done(null,user.id);
  });

  passport.deserializeUser((id,done)=>{
    User.findById(id, (err, user)=>{
      done(err,user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, (req, email, password, done)=>{
      process.nextTick(()=>{
        User.findOne({'local.email':email.toLowerCase()},(err,user)=>{
          if (err){
            return done(err);
          }
          //Checks to see if user with that email exhists
          if (user) {
            return done(null, false, req.flash('signupMessage', "That email is already taken"))
          } else {
            User.findOne({'local.username':req.body.username.toLowerCase()},(err,user)=>{
              if (user) {
                return done(null, false, req.flash('signupMessage', "That username is already taken"));
              } else {
                let newUser = new User();
                newUser.local.fname = req.body.fname;
                newUser.local.lname = req.body.lname;
                newUser.local.age = req.body.age;
                newUser.local.gender = req.body.gender;
                newUser.local.username = req.body.username.toLowerCase();
                newUser.local.email = email.toLowerCase();
                newUser.local.password = newUser.generateHash(password);
                newUser.save((err)=>{
                  if (err){
                    throw err;
                  }
                  req.user = newUser;
                  return done(null, newUser);
                });
              }
            });
          }
        });
      });
    }
  ));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, (req, email, password, done)=>{
      User.findOne({'local.email': email.toLowerCase()}, (err,user)=>{
        if (err){
          return done(err);
        }
        if (!user){
          User.findOne({'local.username': email.toLowerCase()},(err,user)=>{
            if (!user) {
              return done(null, false, req.flash('loginMessage', "No user found"));
            } else {
              if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', "Invalid Password"));
              } else {
                return done(null,user);
              }
            }
          });
        } else {
          if (!user.validPassword(password)){
            return done(null, false, req.flash('loginMessage', "Invalid Password"));
          } else {
            return done(null, user);
          }
        }
      });
  }));
};
