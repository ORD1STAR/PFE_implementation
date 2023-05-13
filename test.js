bc = require("bcryptjs")

bc.compare("testDeMdp", "$2a$14$uxkOckA1QH4qGjf.A7lYVOfdxxUSS/l3jcMggVSQzw9L91ENRsadG", function(err, res) {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
