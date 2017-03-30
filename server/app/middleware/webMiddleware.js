module.exports = {
  // Sets req.user to curent logged in user if there is one
  setLoginStatus: function(req,res,next) {
    req.isAuthenticated();
    next();
  },

  // Checks if user is logged in, if not it redirects to root
  loginRedirect: function(req,res,next){
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  }
}
