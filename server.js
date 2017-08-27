const http = require('http');
const fs = require('fs');
const path = require('path');
function public(req, res){
	const extension = path.extname(req.url);
	let contentType = '';

	switch (extension){
		case '.html':
		  contentType = 'text/html';
		  break;
		case '.css':
		  contentType = 'text/css';
		  break;
		case '.js':
		  contentType = 'text/javascript';
		  break;
		case '.png':
		   contentType = 'image/png';
		   break;
		default:
		contentType = 'text/plain';        
	}
	res.statusCode = 200;
res.setHeader('Content-Type',contentType);

const stream = fs.createReadStream(path.join(__dirname,'..','public',req.url));
stream.pipe(res);
stream.on('error',error =>{
	if(error.code ==='ENOENT'){
		res.writeHead(404,{'content-Type':'text/plain'});
		res.end('Not faund');

	}else{
		res.writeHead(500,{'content-Type':'text/plain'});
		res.end(error.massage);
	}
});
}
function home(req,res){
	res.statusCode = 200;
	res.setHeader('Content-Type','text/html');
	const stream = fs.createReadStream(path.join(__dirname,'..','public','index.html'));
	stream.pipe(res);
}
function get(title,done){
   const reg = http.get(`http://www.omdbapi.com/?t=${title}`, res=>{
   	 if(res.statusCode!==200){
   	 	done(new Error(`Ошибка:${error.message}`));
   	 	res.resume();
   	 	return;
   	 }
   });
}

http.createServer((req,res)=>{
	if(req.url.match(/\.(html|css|js|png)$/)){
        public(req,res);
	}else if(req.url === '/'){
       home(req,res);
	} else if(req.url.startsWith('/search')){
        search();
	} else {
       notFound();
	}
}).listen(3000, ()=>console.log('Сервер работает'))