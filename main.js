var http = require('http');
var fs = require('fs');
var url = require('url')
var qs = require('querystring')

function templateHTML(title, list, body){
	return `
	<!doctype html>
	<html>
	<head>
		<title>WEB1 - ${title}</title>
		<meta charset="utf-8">
	</head>
	<body>
		<h1><a href="/">WEB</a></h1>
		${list}
		<a href="/create">create</a>
		${body}
	</body>
	</html>
	`;
}

function templateList(filelist){
	var list = '<ul>'
	var i = 0;
	while(i < filelist.length){
		list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
		i = i + 1;
	}
	list = list + '</ul>'
	return list;
}

var app = http.createServer(function(request,response){
	//request 요청할 떄 웹브라우져가 보낸 정보들
	//response 응답할 때 우리가 웹브라우져에 전송 할 정보들 
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	if(pathname === '/'){
		if(queryData.id === undefined){
			fs.readdir('./data', function(error, filelist){
				var title = '안녕하세요';
				var description = 'Hello, Node.js';
				var list = templateList(filelist);
				var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
				response.writeHead(200);
				response.end(template);
			});
		} else {
			fs.readdir('./data', function(error, filelist){
				fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
					var title = queryData.id;
					var list = templateList(filelist);
					var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
					response.writeHead(200);
					response.end(template);
				});
			});
		}	
	} else if(pathname === '/create'){
		fs.readdir('./data', function(error, filelist){
			var title = 'Web - create';
			var list = templateList(filelist);
			var template = templateHTML(title, list, `
				<form action="http://localhost:3000/create_process" method="post">
					<p>
						<input type="text" name="title" placeholder="title" >
					</p>
					<p>
						<textarea name="description" placeholder="description"></textarea>
					</p>
					<p>
						<input type="submit">
					</p>
				</form>	
			`);
			response.writeHead(200);
			response.end(template);
			
	})
} else if(pathname === '/create_process') {
	var body = '';
	request.on('data', function(data){
		body = body + data;
	})
	request.on('end', function(){
		// 아래 코드는 데이터를 타이틀과 디스크립션으로 나눠서 받는 방법
		var post = qs.parse(body); // parse : 정보를 객체화 할 수 있게 해주는 함수
		var title = post.title;
		var description = post.description;
		// 포스트방식으로 전송된 데이터를 데이터 디렉토리안에 파일의 형태로 저장하는 방법
		fs.writeFile(`data/${title}`, description, 'utf8', function(err){
			response.writeHead(302, 
				{Location:`/?id=${title}`}); // 200은 성공했다는 뜻, 302는 다른곳으로 리다이렉트하라는 뜻
			response.end();
		})
		
	});

} else {
		response.writeHead(404);
		response.end('not found');
	}
});

app.listen(3000);