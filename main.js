var restify = require('restify');
var awsModel= require('./models/aws.js');
var mongoose = require('mongoose');
var config = require('./config.json')
var awsConf = undefined;


var server = restify.createServer({  
  name: 'Pilotos',
});



server.use(restify.urlEncodedBodyParser({
  mapParams: true
}));


server.use(restify.queryParser());
server.use(restify.gzipResponse());

  
//soporte de crossdomain
server.pre(require('./utils/cross.domain'));

mongoose.connection.on('open', function(ref){
   
        console.log('Conectado a Mongo');

        awsModel.findOne(function(err,awsConf){
        
        if(err)
        {
        console.log(err)
        return;
        }
            
        
        
        new require('./controllers/helloCtrl.js')(server);
        new require('./controllers/snsCtrl.js')(awsConf, server);
        
        server.listen(6060);
        
        
        });
        
     

});

mongoose.connection.on('error', function(err){
  console.log('no se pudo realizar la conexión con mongo');
  console.log(err);
  return console.log(err.message);
});

var dbUrl = 'mongodb://' + config.dbUser + ":" + config.dbPass + "@" + config.dbUrl + "/" + config.dbName;

try {
  //nos conectamos a la base de datos  

  mongoose.connect( dbUrl );
  console.log('Iniciando conexión en: ' + dbUrl + ', esperando...');



} catch (err) {

  console.log('Conexión fallida a: ' + dbUrl);

}



// usamos todos los cores disponibles en la máquina
// para un mejor rendimiento del app




