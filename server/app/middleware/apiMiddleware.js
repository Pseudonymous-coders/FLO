const jwt = require('jsonwebtoken');
const sqlite3  = require('sqlite3');

module.exports = {
  getToken: function getToken(req,res){
    const User = require('../../app/models/user');
    const tokenExpireLength = (1/60)*60*3;

    User.findOne({"local.email": req.body.email}, (err, user)=>{
      if (err) {
        res.json({'success': false, 'message': "invalid username/password"});
      }
      if (!user) {
        User.findOne({"local.username": req.body.email || req.body.username}, (err, user)=>{
          if (err) {
            res.json({'success': false, 'message': "invalid username/password"});
          }
          if (!user){
            res.json({'success': false, 'message': "account not found"});
          } else {
            if (!user.validPassword(req.body.password)) {
              res.json({'success': false, 'message':"invalid username/password"});
            } else {
              let token = jwt.sign(user, "criwasactuallynotfirst", {
                expiresIn: 60*60*tokenExpireLength,
              });
              res.json({
                'success': true,
                'token': token,
                'expiresIn': Math.round(new Date().getTime()/1000+(60*60*tokenExpireLength))
              });
            }
          }
        });
      } else {
        if (!user.validPassword(req.body.password)) {
          res.json({'success': false, 'message':"invalid username/password"});
        } else {
          let token = jwt.sign(user, "criwasactuallynotfirst", {
            expiresIn: 60*60*tokenExpireLength,
          });
          res.json({
            'success': true,
            'token': token,
            'expiresIn': Math.round(new Date().getTime()/1000+(60*60*tokenExpireLength))
          });
        }
      }
    });
  },
  isVerified: function isVerified(req,res,next){
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token){
      jwt.verify(token, 'criwasactuallynotfirst', (err, decoded)=>{
        if (!err) {
          req.user = decoded.$__.scope;
          next();
        } else {
          res.json({success: false, message:'Authentication token not accepted'});
        }
      });
    } else {
      if (req.isAuthenticated()) return next();
      res.json({success: false, message:'No token given'});
    }
  },
}
