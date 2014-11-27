var hello = function(server){
		

		function get(req, res, next){

			    var GET = req.params; 

			    res.json({text:"hello " + GET.name});

		}


		function post(req, res, next){

			  var POST = req.body;
			  var GET = req.params;
			  	

			  if(!POST.template)
			  	 {
			  	 	res.send(500,{"error" :  ":/ algo malo ha sucedido"});			  	 			  	 
			  	 	return;
			  	 }

			   res.json({"text" : POST.template.replace(/\{\{name\}\}/, GET.name)});

			   next();

		}


		server.get('/hello/:name', get);
		server.post('/hello/:name', post);
		server.del('/hello/:name', get);
		server.put('/hello/:name', get);
	
}



module.exports = hello;