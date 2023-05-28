bc = require("bcryptjs")

bc.hash("mdpJack", 14, function(err, hash) {
    console.log(hash)
})
