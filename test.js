bc = require("bcryptjs")

bc.hash("mdpRacym", 14, function(err, hash) {
    console.log(hash)
})
