module.exports = {
  'secret': "criwasactuallynotfirst",
  'url': "mongodb://pseudonymous:Criwasfirst1@ds145138.mlab.com:45138/slumberusers",
  'options':{
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: { socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
  },
}
