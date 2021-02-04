var http = require('http');
var fs = require('fs');
var url = require('url')

var app = http.createServer(function(request,response){
		var _url = request.url;
		var queryData = url.parse(_url, true).query;
		var title = queryData.id
		console.log(_url)
		console.log(queryData)
		console.log(queryData.id)
		if(_url == '/'){
			title = 'Welcome'
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
		response.writeHead(200);
		fs.readFile(`data/${queryData.id}`, 'utf8',
		function(err, description){
			var template = `
			<!doctype html>
			<html>
			<head>
				<title>WEB1 - ${title}</title>
				<meta charset="utf-8">
			</head>
			<body>
				<h1><a href="/">${title}</a></h1>
				<ul>
					<li><a href="/?id=HTML">HTML</a></li>
					<li><a href="/?id=CSS">CSS</a></li>
					<li><a href="/?id=HTML">JavaScript</a></li>
				</ul>
				<h2>${title}</h2>
				<p>${description}</p>
				<p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
				</p>
			</body>
			</html>
			`;
			response.end(template);
		})
});

app.listen(3000); //3000 포트에 nodejs를 실행! 