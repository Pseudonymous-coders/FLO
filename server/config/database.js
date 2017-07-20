module.exports = {
  'secret': "criwasactuallynotfirst",
  'url': "mongodb://pseudonymous:safe-shop-pass@ds011321.mlab.com:11321/safe-shop",
  'options':{
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: { socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
  },
}