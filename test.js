//bc = require("bcryptjs")
//
//bc.hash("mdpJack", 14, function(err, hash) {
//    console.log(hash)
//})


A = [{matri:1, t:"a"}, {matri:2, t:"b"}, {matri:4, t:"r"}]
b = {matri:1, t:"a"}
console.log(Object.keys(A).includes(b.matri));