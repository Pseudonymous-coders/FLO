const apiMiddleware = require('./middleware/apiMiddleware');

module.exports = (app, passport)=>{

  app.get('/api/', (req,res)=>{
    res.send("Slumber API endpoint");
  });

  app.get('/api/authenticate', apiMiddleware.isVerified, (req,res)=>{
    res.json({success: true});
  });

  app.post('/api/authenticate', apiMiddleware.getToken);
}
