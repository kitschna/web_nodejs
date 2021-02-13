var fs = require('fs')

//readFileSync

/*
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8'); 
//readFileSync는 동기적, 리턴값을 반환
console.log(result);
console.log('C');
*/


console.log('A'); //readFile는 비동기적, 
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
	console.log(result)
	}
); 
console.log('C');