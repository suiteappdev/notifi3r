function snsCtrl(data , server, callback){
    var AWS       = require('aws-sdk');
    var users     = require('../models/user.js');
    var should    = require('should');
    var mongoose  = require('mongoose');
    var SNS       = require('sns-mobile');
    var data      = data;

    console.log(data, "sns");
  AWS.config.update(data);

    /*
        POST /push/send    
            @param message String -> mensaje de la notificación
            @param user_id String -> id del usuario

        POST /push/register
            @param device_id String -> id del dispositivo
            @param user_id String -> id del usuario
            @param device_platform String -> plataforma del dispositivo android || ios

            GET /push/user/{{user_id}}  -> obtener un usuario por id
            GET /push/users -> obtener todos los usuarios
            DELETE /push/user/{{user_id}} -> eliminar un usuario por id

        Missing required key 'PlatformApplicationArn' in params
    */

    function findByUserId(user_id, callback){
      users.find({user_id : user_id}, callback);
    }

    function deleteByUserId(user_id, callback){
        users.remove({user_id : user_id}, callback)
    }


    function send(req, res, next){
        var POST = (req.body instanceof Object) ? req.body : req.params;
        console.log(req.params, 'params');
        POST = (POST instanceof String) ? JSON.parse(POST) : POST;
        console.log(POST);

        if(!POST.message || !POST.user_id){
          res.send(500, {response: {}, message : "error de parametros", time : Date.now});
            return;
        }

        findByUserId(POST.user_id, function(err, user){
            console.log(user);

            if(err){
              res.send(500, {response: {}, time : Date.now, message : err});
              return;
            }


            var notification = {
                data: {
                    title : "Pilotos Mobile",
                    action : POST.action || {}
                }
            }

            for(x in user){
                console.log(user[x].endpointArn);
                notification.data.message = POST.message

                var notifier = getNotifier(user[x].device_platform);
                notifier.sendMessage(user[x].endpointArn, notification, function(err, messageId) {  
                    if(err) {
                        res.send(500, {response : {}, message : err, time : Date.now});
                        return;
                    }
                });
            }

            res.send({message:"notificación enviada"});
        });
    }

    function update(data, callback){
        users.findOneAndUpdate({user_id : data.user_id}, data, callback);
    }

    function register(req, res, next){
        var POST = (req.body instanceof Object) ? req.body : req.params;
        POST = (POST instanceof String) ? JSON.parse(POST) : POST;
        console.log(POST);

        //validamos variables del request
        if(!POST.device_id || !POST.user_id || !POST.device_platform){
          res.send(500, { response : {}, code : 500, message :"error de parametros", time : Date.now});
            return;
        }

        //registramos el dispositivo
        var notifier = getNotifier(POST.device_platform);
        console.log(notifier);
        notifier.addUser(POST.device_id, null, function(err, endpointArn) {
            if(err){                    
              res.send(500, { response : {}, time : Date.now, message: err, code : 500});
              return;
            }

            //validamos si el usuario ya esta relacionado en nuestra db, si lo esta entonces actualizamos el doc
          users.count({user_id : POST.user_id},function(err, count){

                /*
                  if(count > 0)
                      update({device_id : POST.device_id , device_platform : POST.device_platform, user_id : POST.user_id, endpointArn : endpointArn}, function(err, user){
                          if(err){
                                res.send(500, {err : err, time : Date.now});
                                return;
                            }                    

                            res.json({message:"dispositivo registrado", response: user, updated : true, code: 200});
                            next();
                        });
                  else //sino esta creamos el usuario

                */

              users.create({device_id : POST.device_id ,  device_platform : POST.device_platform, user_id : POST.user_id, endpointArn : endpointArn}, function(err, user){
                if(err){
                      res.send(500, {response : {}, message : err, code:200,time : Date.now});
                        return;
                    }

                    //todo esta listo
                  res.json({message:"dispositivo registrado", response: user, code:200 });
                next();
                });
            });
        });
    }

    // obtenemos el objeto indicado para el registro del dispositivo ios o android
    function getNotifier(device_platform){
        console.log(data.androidArn)
        if(device_platform.match('kindle'))
            return new SNS({
                platform: SUPPORTED_PLATFORMS.KINDLE_FIRE,
                region: data.region,
                apiVersion: '2010-03-31',
                accessKeyId: data.accessKeyId,
                secretAccessKey: data.secretAccessKey,
                platformApplicationArn: data.androidArn
            });

            return (device_platform.match('android')) ? 
                new SNS({
                    platform: SNS.SUPPORTED_PLATFORMS.ANDROID,
                    region: data.region,
                    apiVersion: '2010-03-31',
                    accessKeyId: data.accessKeyId,
                    secretAccessKey: data.secretAccessKey,
                    platformApplicationArn: data.androidArn
                })

                :

                new SNS({
                    platform: SNS.SUPPORTED_PLATFORMS.IOS,
                    region: data.region,
                    apiVersion: '2010-03-31',
                    accessKeyId: data.accessKeyId,
                    secretAccessKey: data.secretAccessKey,
                    sandbox: true,
                    platformApplicationArn: 'arn:aws:sns:us-east-1:482407636571:app/APNS_SANDBOX/Pilotos'
                });
    }

    function getByUserId(req, res, next){
        var GET = req.params;

        if(!GET.user_id){
        res.send(500, {response: "response de parametros", time : Date.now});                 
          return;
        }

        findByUserId(GET.user_id, function(err, user){
          if(err){
            res.send(500, {response:{}, message:err, time: Date.now, code:500});
            return;
          }

          res.send({response: user, code:200, message:"ok"});
          next();
        });
    } 

    function getAllusers(req, res, next){
      users.find(function(err, users){
          if(err){
            res.send(500, {response:err, time : Date.now, code:500});
            return;
          }

            res.send({response:users, code : 200, message : "ok"});
            next();
      });
    }

    function deleteUser(req, res, next){
      var DEL = req.params;
      deleteByUserId(DEL.user_id, function(err, user){
          if(err){
              res.send(500, {response:err, time: Date.now, code:500});
              return;
            }

            res.send({message : "usuario eliminado"});
            next();
      });
    }

    server.get('/push/users', getAllusers);
    server.get('/push/user/:user_id', getByUserId);
    server.post('/push/register', register);
    server.post('/push/send', send);
    server.del('/push/user/:user_id', deleteUser);
}

module.exports = snsCtrl
