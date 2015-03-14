![minios](http://www.soluntech.com/_/rsrc/1412805517236/config/customLogo.gif?revision=7)



PILOTOS DE BARRANQUILLA
=======================


Notifi3r
--------

Notifi3r es una APP que envía notifiaciones a dispositivos móviles, usando AMAZON SNS. Notifi3r esta desarrollada con Node.js y MongoDB, usando los modulos que se pueden ver dentro del archivo [package.json](https://github.com/SOLUNTECH/pilotos/blob/master/notifi3r/package.json). Notifi3r es un servicio web independiente, que responde con codigo HTTP 200 o 500 por cabecera, dependiendo el resultado de la solicitud. 


Para usar notifier haga los REQUEST como se muestran a continuación: 


Registrar un dispositivo:


```html 

POST /notifi3r/push/register
	   @param device_id String -> id del dispositivo
	   @param user_id String -> id del usuario
	   @param device_platform String -> plataforma del dispositivo android || ios
```	   

Enviar Notificación:

```html

POST /notifi3r/push/send	   
	   @param message String -> mensaje de la notificación
	   @param user_id String -> id del usuario

```	   

Obtener un usuario por id:

```html
GET /notifi3r/push/user/{{user_id}}  
```

Obtener toda la lista de usuarios: 

```html
GET /notifi3r/push/users 
```

Eliminar un usuario:

```html
DELETE /notifi3r/push/user/{{user_id}} -> eliminar un usuario por id
```

Nota: Es altamente recomendable que una vez puesta la app en producción, el directorio de notifi3r sea movido a una carpeta superior a la pública, por razones de seguridad. 


