bc = require("bcryptjs")

bc.hash("adminadmin", 14, function(err, hash) {
    console.log(hash)
})
