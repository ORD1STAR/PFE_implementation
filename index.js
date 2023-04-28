const express = require('express');
const path = require('path')
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql')
const crypto = require('crypto')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

connection = mysql.createConnection({
    host: 'mysql-gtrpfe.alwaysdata.net',
    user: "gtrpfe",
    password: "USTHBpfe23",
    database: "gtrpfe_pfe"
});
connection.connect(function(err) {
    if(err){
        return console.error("error" + err.message);
    }
    console.log("Connected to the MySQL server");
});

io = require('socket.io')(http);

app.get('/', (req, res) => {
    if(req.cookies["login"]){
        res.redirect("/home");
    }else{
        res.redirect("/login");
    }
});
app.get('/login', (req, res) => {
    if(Object.keys(req.query).length == 2){
        username = req.query["username"]
        password = req.query["password"]
        allTokens = []
        connection.query("SELECT token FROM user", function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            for(i = 0; i < result.length; i++){
                allTokens.push(result[i]["token"]);
            }
        })

        connection.query("SELECT * FROM user WHERE login = ? AND password = ?", [username, password], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length > 0){
                if(result[0]["token"] == "" || req.cookies["token"] == null){
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let token = '';
                    for (let i = 0; i < 20; i++) { token += characters.charAt(Math.floor(Math.random() * characters.length)); }

                    while(allTokens.includes(token)){
                        token = ''
                        for (let i = 0; i < 20; i++) { token += characters.charAt(Math.floor(Math.random() * characters.length)); }
                    }
                    connection.query("UPDATE user SET token = ? WHERE idUser = ?", [token, result[0]["idUser"]], function(err, result, fields){
                        if(err){
                            console.log(err.message);
                        }
                    })
                    res.cookie('token', token, { maxAge: 1000*60*60*24 });
                }
                res.redirect("/home")
            } else{
                res.redirect("/login" + "?error=true");
            }
        })
    }else{
        res.sendFile(path.join(__dirname, 'public/html/login.html'));
    }
    
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/main.html'));
});


const fs = require('fs')
const fileBuffer1 = fs.readFileSync('test.txt');
const fileBuffer2 = fs.readFileSync('test2.txt');

const combinedBuffer = Buffer.concat([fileBuffer1, fileBuffer2]);
const combinedBase64 = combinedBuffer.toString('base64');


//req = "INSERT INTO postes (postID, contenu, sectionID, ensID, codeModule, PJ, PJ_lens, PJ_names) VALUES (?,?,?,?,?,?,?,?)"
//lens = `${String(fileBuffer1.byteLength)},${String(fileBuffer2.byteLength)}`
//names = "test1.txt/test2.txt"
//connection.query(req, [4, "plusieurs fichier sont presents dans ce poste", 1, 121212121213, "DB3", combinedBuffer, lens, names], function(err, result, fields){
//    if(err){
//        console.log(err.message);
//    }
//})



io.on('connection', (socket) => {
    console.log("+ " + socket.id);

    socket.on('connected', (cookie) => {
        token = cookie[0].split('=')[1];
        
        connection.query("SELECT role FROM user WHERE token = ?", [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length > 0){
                const role = result[0]["role"]
                if(role == "etudiant"){
                    connection.query("SELECT login, niveau, specialite, idSec FROM user, etudiant, section WHERE user.idUser=etudiant.userID AND etudiant.section=section.idSec AND user.token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            connection.query("SELECT nom FROM module WHERE secID=?", [result1[0]["idSec"]], function(err, result2, fields){
                                if(err){
                                    console.log(err.message);
                                }
                                if(result2.length > 0){
                                    socket.emit('connectedEtu', [result1[0], result2]);
                                }
                            })
                        }
                    })
                }
                else if(role == "enseignant"){
                    connection.query("SELECT login  FROM user WHERE token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            connection.query("SELECT nom, niveau, specialite FROM module, section, enseignant, user WHERE user.token = ? AND user.idUser = enseignant.userID AND enseignant.ensID = module.enseignantID AND module.secID = section.idSec", [token], function(err, result2, fields){
                                if(err){
                                    console.log(err.message);
                                }
                                if(result2.length > 0){
                                    socket.emit('connectedEns', [result1[0], result2]);
                                }
                            })
                        }
                    })
                }

            }

        })
    });

    socket.on("getPosts", (data) => {
        // TODO: use UNION to get post content, end login, the module name
        if(data[1] == "General"){
            req = "SELECT user.login, postes.contenu, postes.PJ, postes.PJ_lens, postes.PJ_names, module.nom, postes.date FROM postes, user, module, enseignant WHERE postes.ensID = enseignant.ensID AND enseignant.userID = user.idUser AND postes.codeModule = module.codeMod AND enseignant.sectionID = ? order by postes.date DESC"
        }else{
            req = "SELECT user.login, postes.contenu, postes.PJ, postes.PJ_lens, postes.PJ_names, module.nom, postes.date FROM postes, user, module, enseignant WHERE postes.ensID = enseignant.ensID AND enseignant.userID = user.idUser AND postes.codeModule = module.codeMod AND enseignant.sectionID = ? AND module.nom = '" + data[1] + "' order by postes.date DESC"
        }
        
        connection.query(req, [data[0]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getPosts", result);
        })
    });

    socket.on("getPostsE", (data) => {
        profToken = data[0].split('=')[1];
        module = data[1]
        // TODO: use UNION to get post content, end login, the module name
        req = "SELECT login, module.nom, contenu, PJ, date FROM postes, enseignant, user, module WHERE postes.ensID = enseignant.ensID AND enseignant.userID = user.idUser AND user.token = ? and postes.codeModule = module.codeMod AND module.nom = ? order by postes.date DESC"
        
        
        connection.query(req, [token, module], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getPostsE", result);
        })
    });

});




http.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);