const express = require('express'); 
const path = require('path')
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const salt = 14
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');

const nodemailer = require('nodemailer');
const e = require('express');
const { log } = require('console');

var verifCode = {}

// Créer un transporteur SMTP pour envoyer des e-mails
let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'SuperEntUSTHB@hotmail.com',
        pass: 'gtrPFE2223'
    }
});


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

io = require('socket.io')(http, {maxHttpBufferSize:1*1024*1024*10});

app.get('/', (req, res) => {
    if(req.cookies["token"]){
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                res.redirect("/home");
            }else{
                res.redirect("/login");
            }
        })
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
        connection.query("SELECT * FROM user WHERE login = ?", [username], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){

                bcrypt.compare(password, result[0]["password"], function(err, resu) {
                    if(resu){
                        if(result[0]["token"] == ""){
                            token = generateToken(allTokens);
                            connection.query("UPDATE user SET token = ?, token_expire = NOW() + INTERVAL 1 DAY WHERE idUser = ?", [token, result[0]["idUser"]], function(err, result, fields){
                                if(err){
                                    console.log(err.message);
                                }
                            })
                            res.cookie('token', token, { maxAge: 1000*60*60*24 });
                        } else if(result[0]["token"] != "" && new Date(result[0]["token_expire"]) >= new Date()){
                            time = new Date(result[0]["token_expire"]) - new Date();
                            res.cookie('token', result[0]["token"], { maxAge: time });
                        }else if(result[0]["token"] != "" && new Date(result[0]["token_expire"]) < new Date()){
                            token = generateToken(allTokens)
                            connection.query("UPDATE user SET token = ?, token_expire = NOW() + INTERVAL 1 DAY WHERE idUser = ?", [token, result[0]["idUser"]], function(err, result, fields){
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
            }
        })
    }else{
        res.sendFile(path.join(__dirname, 'public/html/login.html'));
    }
    
});
app.get('/home', (req, res) => {
    if(Object.keys(req.query).length > 0 && req.cookies["exam"]){
        exam = req.cookies["exam"]
        res.clearCookie("exam");
        reponses = ""
        for(var r in req.query){
            if(typeof(req.query[r]) == "string"){
                reponses += req.query[r] + "|"
            }else{
                reponses += req.query[r].join("#") + "|"
            }
        }
        reponses = reponses.endsWith("|") ? reponses.slice(0, -1) : reponses
        reqs = "SELECT matricule, exam_id FROM etudiant, examens, user WHERE user.token = ? AND user.idUser = etudiant.userID AND examens.url = ?"
        connection.query(reqs, [req.cookies["token"], req.cookies["exam"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length > 0){
                req = "INSERT INTO exams_reponse (etudiant, exam, reponses) VALUES (?,?,?)"
                connection.query(req, [result[0]["matricule"], result[0]["exam_id"], reponses], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                })
            }
        })
    }else if(req.cookies["token"] != undefined){
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                
                        
                        
                token = req.cookies["token"];
                reqs = "SELECT role FROM user WHERE token = ?"
                connection.query(reqs, [token], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    if(result.length > 0){
                        if(result[0]["role"] == "admin"){
                            res.sendFile(path.join(__dirname, 'public/html/Admin_Dashboard.html'));
                        }else{
                            res.sendFile(path.join(__dirname, 'public/html/main.html'));
                        }
                    }
                })
        
            }else{
                res.redirect("/login");
            }
        })
        
    }else{
        res.redirect("/login");
    }
    
});
app.get('/files', (req, res) => {
    if(req.cookies["token"] != undefined){
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                res.sendFile(path.join(__dirname, 'public/html/Fichiers.html'));
            }else{
                res.redirect("/login");
            }
        })
        
    }else{
        res.redirect("/login");
    }
    
});
app.get('/msg', (req, res) => {
    
    if(req.cookies["token"] != undefined){
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                res.sendFile(path.join(__dirname, 'public/html/msgSection.html'));
            }else{
                res.redirect("/login");
            }
        })
        
    }else{
        res.redirect("/login");
    }
});
app.get("/notes", (req, res) => {
    
    if(req.cookies["token"] != undefined){
        
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                res.sendFile(path.join(__dirname, 'public/html/Notes.html'));
            }else{
                res.redirect("/login");
            }
        })
    }else{
        res.redirect("/login");
    }
})
app.get("/edt", (req, res) => {
    if(req.cookies["token"] != undefined){
        
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                res.sendFile(path.join(__dirname, 'public/html/EDTpage.html'));
            }else{
                res.redirect("/login");
            }
        })
    }else{
        res.redirect("/login");
    }
    
})
app.get("/examen*", (reqs, res) => {
    if(reqs.cookies["token"] != undefined){
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){

                examen = reqs.url.replace("/examen", "")
                console.log(examen);
                req = "SELECT * FROM examens WHERE url = ?"
                connection.query(req, [examen], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    if(result.length > 0){
                        res.cookie('exam', examen, { maxAge: 1000*60*60*24 });
                        res.sendFile(path.join(__dirname, 'public/html/exams.html'));
                    }else{
                        res.redirect("/home");
                    }
                })
            }else{
                res.redirect("/login");
            }
        })
        
    }else{
        res.redirect("/login");
    }
})
app.get("/signin", (req, res) => {

    if(Object.keys(req.query).length > 0){
        res.redirect("/login");
    }else{
        res.sendFile(path.join(__dirname, 'public/html/signin.html'));
    }

    
})
app.get("/password", (req, res) => {

    if(Object.keys(req.query).length > 0 && req.query["error"] != "1"){
        if(req.query["email"] != undefined){
            reqs = "SELECT * FROM user WHERE email = ?"
            connection.query(reqs, [req.query["email"]], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
                if(result.length > 0){
                    code = generateCode()
                    verifCode[result[0]["idUser"]] = code
                    setTimeout(() => {
                        delete verifCode[result[0]["idUser"]]
                    }, 5 * 60 * 1000); // 5 minutes in milliseconds
                    envoyerMail(req.query["email"], "SuperENT> Code de vérification", "Votre code de vérification est : " + code)
                    res.sendFile(path.join(__dirname, 'public/html/verify.html'));
                    res.cookie("id", result[0]["idUser"]);

                }else{
                    res.redirect("/password?error=1");
                }
            })
        }else if(req.query["code"] != undefined){
            if(verifCode[req.cookies["id"]] == req.query["code"]){
                
                res.sendFile(path.join(__dirname, 'public/html/changePW.html'));
            }else{
                res.redirect("/password?error=2");
            }
        }else if(req.query["mdp"] != undefined){
            reqs = "UPDATE user SET password = ? WHERE idUser = ?"

            bcrypt.hash(req.query["mdp"], salt, function(err, hash) {
                connection.query(reqs, [hash, req.cookies["id"]], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    res.clearCookie("id");
                    res.redirect("/login");
                })
            })
            
        }
        
    }else{
        res.sendFile(path.join(__dirname, 'public/html/pwdForgot.html'));
    }

    
})
app.get("/pagePersonelle", (req, res) => {
    if(req.cookies["token"] != undefined){
        
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                res.sendFile(path.join(__dirname, 'public/html/pagePerso.html'));
            }else{
                res.redirect("/login");
            }
        })
    }else{
        res.redirect("/login");
    }
    
})
app.get("/Admin_Doleances", (req, res) => {
    if(req.cookies["token"] != undefined){
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                
                
                token = req.cookies["token"];
                reqs = "SELECT role FROM user WHERE token = ?"
                connection.query(reqs, [token], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    if(result.length > 0){
                        if(result[0]["role"] == "admin"){
                            res.sendFile(path.join(__dirname, 'public/html/Admin_Doleances.html'));
                        }else{
                            res.redirect("/home");
                        }
                    }
                })
            }else{
                res.redirect("/login");
            }
        })
    }else{
        res.redirect("/login");
    }
})
app.get("/listeEtudiants", (req, res) => { //here
    
    if(req.cookies["token"] != undefined){
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                token = req.cookies["token"];
                reqs = "SELECT role FROM user WHERE token = ?"
                connection.query(reqs, [token], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    if(result.length > 0){
                        if(result[0]["role"] == "admin"){
                            res.sendFile(path.join(__dirname, 'public/html/listeEtudiants.html'));
                        }else{
                            res.redirect("/home");
                        }
                    }
                })
            }else{
                res.redirect("/login");
            }
        })
        
    }else{
        res.redirect("/login");
    }
})
app.get("/notes/*", (req, res) => {
    if(req.cookies["token"] != undefined){
        
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                
                
                token = req.cookies["token"];
                reqs = "SELECT role FROM user WHERE token = ?"
                connection.query(reqs, [token], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    if(result.length > 0){
                        if(result[0]["role"] == "enseignant"){
                            mod = req.url.replace("/notes/", "")
                            reqs = "SELECT * FROM module WHERE codeMod = ?"
                            connection.query(reqs, [mod], function(err, result, fields){
                                if(err){
                                    console.log(err.message);
                                }
                                if(result.length > 0){
                                    
                                    reqs = `SELECT codeMod, title, max, noteID from note group by codeMod,title,max order by edited desc`
                                    connection.query(reqs, function(err, result2, fields){
                                        if(err){
                                            console.log(err.message);
                                        }
                                            myData = []
                                            result2.forEach(element => {
                                                if(element["codeMod"] == mod){
                                                    d = {}
                                                    d["codeMod"] = element["codeMod"]
                                                    d["title"] = element["title"]
                                                    d["max"] = element["max"]
                                                    d["id"] = element["noteID"]
                                                    myData.push(d)
                                                }
                                            });
                                            res.render("Admin_Notes.ejs", {data: myData, section:result[0]["secID"], module: mod})
                                        
                                    })
                                }else {res.redirect("/home");}
                            })
                        }else{
                            res.redirect("/home");
                        }
                    }
                })
            }else{
                res.redirect("/login");
            }
        })

    }else{
        res.redirect("/login");
    }
})
app.get("/disconnect", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("id");
    res.redirect("/");
})
app.get("/Creation_enseignant", (req, res) => {
    
    if(req.cookies["token"] != undefined){
        reqs = "SELECT * FROM user WHERE token= ?"
        connection.query(reqs, [req.cookies["token"]], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length>0){
                token = req.cookies["token"];
                reqs = "SELECT role FROM user WHERE token = ?"
                connection.query(reqs, [token], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    if(result.length > 0){
                        if(result[0]["role"] == "admin"){
                            res.sendFile(path.join(__dirname, 'public/html/Admin_compteProf.html'));
                        }else{
                            res.redirect("/home");
                        }
                    }
                })
            }else{
                res.redirect("/login");
            }
        })
        
    }else{
        res.redirect("/login");
    }
})

//const fileBuffer1 = fs.readFileSync('test.txt');
//const fileBuffer2 = fs.readFileSync('test2.txt');
//
//const combinedBuffer = Buffer.concat([fileBuffer1, fileBuffer2]);
//const combinedBase64 = combinedBuffer.toString('base64');
//

//req = "INSERT INTO postes (postID, contenu, sectionID, ensID, codeModule, PJ, PJ_lens, PJ_names) VALUES (?,?,?,?,?,?,?,?)"
//lens = `${String(fileBuffer1.byteLength)},${String(fileBuffer2.byteLength)}`
//names = "test1.txt/test2.txt"
//connection.query(req, [4, "plusieurs fichier sont presents dans ce poste", 1, 121212121213, "DB3", combinedBuffer, lens, names], function(err, result, fields){
//    if(err){
//        console.log(err.message);
//    }
//})


timeouts = {}
io.on('connection', (socket) => {
    
    socket.on('connected', (cookie) => {
        var token
        cookies = cookie[0].split('; ')
        cookies.forEach(function(c){
            if(c.startsWith('token=')){
                token = c.split('=')[1]
            }
        })
        connection.query("SELECT role FROM user WHERE token = ?", [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length > 0){
                const role = result[0]["role"]
                //etudiant
                if(role == "etudiant"){
                    connection.query("SELECT login, user.nom, prenom, photo, niveau, specialite, idSec, indice, matricule, email, phone, section.nom as secNom, groupe FROM user, etudiant, section WHERE user.idUser=etudiant.userID AND etudiant.section=section.idSec AND user.token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            console.log("+ student connected> " + result1[0]["login"]);
                            socket.join(result1[0]["login"])
                            socket.join(String(result1[0]["idSec"]))
                            if([...socket.rooms][1] in timeouts){
                                clearTimeout(timeouts[[...socket.rooms][1]])
                                timeouts[[...socket.rooms][1]] = ""
                            }
                            connection.query("SELECT nom, codeMod FROM module WHERE secID=?", [result1[0]["idSec"]], function(err, result2, fields){
                                if(err){
                                    console.log(err.message);
                                }
                                connection.query("SELECT module.codeMod, edited, type, login, user.nom as n, user.prenom as pn FROM module, typeModule, user, note WHERE secID=? AND typeModule.module = module.codeMod AND typeModule.enseignantID = user.idUser AND module.codeMod = note.codeMod order by edited DESC", [result1[0]["idSec"]], function(err, result3, fields){
                                    if(err){
                                        console.log(err.message);
                                    }
                                    socket.emit('connectedEtu', [result1[0], result2, result3]);
                                })
                                
                            })
                        }
                    })
                }
                //enseignant
                else if(role == "enseignant"){
                    connection.query("SELECT login, user.nom, prenom, photo, idUser, phone, email FROM user WHERE token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            console.log("+ teacher connected> " + result1[0]["login"]);
                            socket.join(result1[0]["login"])
                            if([...socket.rooms][1] in timeouts){
                                clearTimeout(timeouts[[...socket.rooms][1]])
                            }
                            connection.query("SELECT idSec, module.nom, niveau, specialite, codeMod, type, section.nom as secNom FROM module, section, typeModule WHERE typeModule.module = module.codeMod AND enseignantID = ? AND module.secID = section.idSec group by codeMod", [result1[0]["idUser"]], function(err, result2, fields){
                                
                                if(err){
                                    console.log(err.message);
                                }
                                connection.query("SELECT codeMod, type, login FROM module, typeModule, user WHERE secID=? AND typeModule.module = module.codeMod AND typeModule.enseignantID = user.idUser", [result1[0]["idSec"]], function(err, result3, fields){
                                    if(err){
                                        console.log(err.message);
                                    }
                                    socket.emit('connectedEns', [result1[0], result2, result3]);
                                })
                                
                            })
                        }
                    })
                }
                //admin
                else if(role == "admin"){
                    connection.query("SELECT login, user.nom, prenom, photo, idUser, email, phone FROM user WHERE token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            console.log("+ admin connected> " + result1[0]["login"]);
                            socket.join(result1[0]["login"])
                            if([...socket.rooms][1] in timeouts){
                                clearTimeout(timeouts[[...socket.rooms][1]])
                            }
                            connection.query("SELECT idSec, module.nom, niveau, specialite, codeMod, type FROM module, section, typeModule WHERE typeModule.module = module.codeMod AND module.secID = section.idSec group by codeMod", [], function(err, result2, fields){
                                
                                if(err){
                                    console.log(err.message);
                                }
                                if(result2.length > 0){
                                    if(result2.length > 0){
                                        connection.query("SELECT codeMod, type, login FROM module, typeModule, user WHERE secID=? AND typeModule.module = module.codeMod AND typeModule.enseignantID = user.idUser", [result1[0]["idSec"]], function(err, result3, fields){
                                            if(err){
                                                console.log(err.message);
                                            }
                                            socket.emit('connectedAdm', [result1[0], result2, result3]);
                                        })
                                    }
                                }
                                
                            })
                        }
                    })
                }
            }
        })
        
    }); 

    socket.on("getPosts", (data) => {
        args = []
        if(data[0] == "General"){
            req = `
            SELECT prf.login, prf.nom as n, prf.prenom as pn, prf.role, postes.contenu, postes.postID, postes.PJ_lens, postes.PJ_names, module.nom, type, postes.date, postes.comm, postes.traveauRendre, postes.deadline
            FROM user etu, user prf, postes, module, etudiant
            WHERE
            etu.token = "${data[1]}" AND
            etudiant.userID = etu.idUser AND
            postes.codeModule = module.codeMod AND
            module.secID = etudiant.section AND
            prf.idUser = postes.ensID

            group by postID 
            order by postes.date DESC
            LIMIT ${data[2]}
            `
        }else{
            req = `
            SELECT prf.login, prf.nom as n, prf.prenom as pn, prf.role, postes.contenu, postes.postID, postes.PJ_lens, postes.PJ_names, module.nom, type, postes.date, postes.comm, postes.traveauRendre, postes.deadline
            FROM user etu, user prf, postes, module, etudiant
            WHERE
            etu.token = "${data[1]}" AND
            etudiant.userID = etu.idUser AND
            postes.codeModule = module.codeMod AND
            module.secID = etudiant.section AND
            prf.idUser = postes.ensID AND
            module.nom = ?

            group by postID 
            order by postes.date DESC
            LIMIT ${data[2]}
            `
            args = [data[0]]
        }
        
        connection.query(req, args, function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getPosts", result);
        })
        
    });

    socket.on("getPostsE", (data) => {
        profToken = data[0];
        module = data[1]
        secID = data[2]
        // TODO: use UNION to get post content, end login, the module name
        req = `SELECT prf.login, prf.nom as n, prf.prenom as pn, prf.role, module.nom, contenu, type, postID, PJ_lens, PJ_names, date, comm, traveauRendre, deadline
        FROM user prf, module, postes
        WHERE
        
        prf.token = ? AND
        prf.idUser = postes.ensID AND
        postes.codeModule = module.codeMod AND
        module.secID = ? AND
        module.nom = ?
        
        order by postes.date DESC
        LIMIT ${data[3]}`
        connection.query(req, [profToken, secID, module], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getPostsE", result);
        })
    });

    socket.on("getPostsA", (data) => {
        module = data[0]
        secID = data[1]
        // TODO: use UNION to get post content, end login, the module name
        req = `SELECT prf.login, prf.nom as n, prf.prenom as pn, prf.role, module.nom, contenu, type, postID, PJ_lens, PJ_names, date, comm, traveauRendre 
        FROM user prf, module, postes
        WHERE
        
        prf.idUser = postes.ensID AND
        postes.codeModule = module.codeMod AND
        module.secID = ? AND
        module.nom = ?
        
        order by postes.date DESC`
        connection.query(req, [secID, module], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getPostsA", result);
        })
    });

    socket.on("setPost", (data) => {
        
        files = data[4]
        buffers = []
        lens = ""
        names = ""
        comm = data[7]
        travb = data[8]
        type = data[9]
        travD = data[10]
        req = `INSERT INTO postes(contenu, ensID, codeModule, PJ, PJ_lens, PJ_names, comm, traveauRendre, type ${travD != "" ? ", deadline" : ""}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?${travD != "" ? ", ?" : ""})`
        
        for(var i = 0; i < Object.keys(files).length; i++){
            fileBuffer = Buffer.from(files[i], 'base64');
            buffers.push(fileBuffer)
            lens += `${data[5][i]}/`
            names += `${data[6][i]}/`
        }
        lens = lens.slice(0, -1)
        names = names.slice(0, -1)
        combinedBuffer = Buffer.concat(buffers);
        const combinedBase64 = combinedBuffer.toString('base64');
        args = [data[2], data[1], data[3], combinedBuffer, lens, names, comm ? 1:0, travb ? 1:0, type]
        if(travD != "" ){
            args.push(travD)
        }else{
            args[7] = 0
        }
        connection.query(req, args, function(err, result, fields){
            if(err){
                console.log(err.message);
            }
        })

    });

    socket.on("newPost", (data) => {
        section = data[0]
        module = data[1]
        io.to(section).emit("newPost", module);
    })

    socket.on("download", (data) => {
        id = data[0]
        fileName = data[1]
        
        curs = 0
        req = `
            SELECT postes.PJ, postes.PJ_lens, postes.PJ_names
            FROM postes
            WHERE
            postes.postID = ?
        `
        connection.query(req, [id], function(err, result, fields){
            lens = result[0]["PJ_lens"].split("/")
            names = result[0]["PJ_names"].split("/")
            if(err){
                console.log(err.message);
            }

            for(var i = 0; i < lens.length; i++) {
                curs += parseInt(lens[i])
                if(names[i] == fileName){
                    
                    socket.emit("Upload", result[0]["PJ"].slice(i==0 ? 0 : parseInt(lens[i-1]), curs+1));
                }
            }

        })
        

    })

    socket.on("downloadP", (path) => {
        if(path.split("/")[path.split("/").length-1] == "USTHB_Plan.pdf"){

            const fs = require('fs');
            file = fs.readFileSync(path)
            // [blob file, file name]
            data = [file, path.split("/")[path.split("/").length-1]]
            
            
            socket.emit("UploadP", data);
        }

        
        

    })

    socket.on("showComms", (postID) => {
        req = "SELECT content, login, nom, prenom, photo FROM commentaires, user WHERE commentaires.postID = ? AND user.idUser = commentaires.sender order by date DESC"
        connection.query(req, [postID], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getComms", result)
        })
    })

    socket.on("sendComment", (data)=>{
        token = data[0]
        content = data[1]
        postID = data[2]

        connection.query("SELECT idUser, login FROM user WHERE token=?", [token], function(err, userID, fields){
            if(err){
                console.log(err.message);
            }
            
            req = `INSERT INTO commentaires(postID, sender, content) VALUES (?,?,?)`
            connection.query(req, [postID, userID[0]["idUser"], content], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
                socket.emit("setComment", userID[0]["login"])
            })

        })


    })

    socket.on("getFiles", (data)=>{
        token = data[0] // ta3 le prof
        module = data[1] // nom module 
        req = ""
        if(module == "General"){
            req = `SELECT postes.PJ_lens, postes.PJ_names, postID FROM postes, user ens, module, etudiant WHERE ens.token = ? AND ens.idUser = etudiant.userID AND module.codeMod = postes.codeModule AND module.secID = etudiant.section AND NOT PJ = "" order by postes.date DESC`
        }else{
            req = `SELECT postes.PJ_lens, postes.PJ_names, postID FROM postes, user ens, module, etudiant WHERE ens.token = ? AND ens.idUser = etudiant.userID AND module.codeMod = postes.codeModule AND module.secID = etudiant.section AND NOT PJ = "" AND module.nom = '${module}' order by postes.date DESC`
        }
        
        
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getFiles", result)
        })
    })

    socket.on("getFilesE", (data)=>{
        token = data[0] // ta3 le prof
        module = data[1] // nom module 
        secID = data[2]
        req = `SELECT postes.PJ_lens, postes.PJ_names, postID FROM postes, module WHERE module.nom = '${module}' AND module.secID = '${secID}' AND module.codeMod = postes.codeModule  order by postes.date DESC`
        
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getFilesE", result)
        })
    })

    socket.on("getChat", (data) => {
        token = data[0]
        login = data[1]

        // get my id
        req = `SELECT idUser FROM user WHERE token = ?`
        connection.query(req, [token], function(err, myID, fields){
            if(err){
                console.log(err.message);
            }
            myID = myID[0]["idUser"]
            // get his id
            req = `SELECT idUser, photo, nom, prenom FROM user WHERE login = ?`
            connection.query(req, [login], function(err, data, fields){
                if(err){
                    console.log(err.message);
                }
                hisID = data[0]["idUser"]
                hisPic = data[0]["photo"]
                hisNom = data[0]["nom"] + " " + data[0]["prenom"]
                // get chat
                req = `
                Select discussionID FROM discussion WHERE 
                (personneA = ${myID} AND personneB = ${hisID}) OR
                (personneA = ${hisID} AND personneB = ${myID})
                `
                connection.query(req, [token], function(err, discussion, fields){
                    if(err){
                        console.log(err.message);
                    }

                    if(discussion.length == 0){
                        // create chat
                        req = `INSERT INTO discussion(personneA, personneB) VALUES (?,?)`
                        connection.query(req, [myID, hisID], function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
                            socket.emit("getChat", ["empty", result.insertId, hisPic, hisNom])
                        })

                    }
                    else{
                        //get all messager from table "message"
                        req = `SELECT * FROM message WHERE discussionID = ? order by date asc`
                        connection.query(req, [discussion[0]["discussionID"]], function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
                            if(result.length == 0){
                               socket.emit("getChat", ["empty", discussion[0]["discussionID"], hisPic, hisNom])
                            }else{
                                socket.emit("getChat", [result, myID, hisPic, hisNom])
                            }
                        })
                    }

                })
            
            })
            



        })
    })

    socket.on('deletePost', (data => {


        req = `DELETE FROM commentaires WHERE postID = ${data}`
        connection.query(req, function(err, result, fields) {
            if (err) {
                console.log(err.message);
            }
            req = `DELETE FROM postes WHERE postID = ${data}`
            connection.query(req, function(err, result, fields) {
                if (err) {
                    console.log(err.message);
                }
                socket.emit("success", 2)
            })
        })
        
    }))

    socket.on("addMessage", (data) => {
        token = data[0]
        discutID = data[1]
        content = data[2]
        hisLogin = data[3]

        //create a request to add the message in the message table

        req = "SELECT idUser, login FROM user WHERE token = ?"
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            userID = result[0]["idUser"]
            myLogin = result[0]["login"]

            req = `INSERT INTO message(discussionID, sender, contenu) VALUES (?,?,?)`
            connection.query(req, [discutID, userID, content], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
                io.to(hisLogin).emit("recvMessage", [myLogin, content, hisLogin])
            })
        })
    })

    socket.on("getDMs", (token) => {
        req = `SELECT idUser FROM user WHERE token = ?`
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            myID = result[0]["idUser"]

            req = `SELECT discussionID, login, specialite, niveau, module.nom, codeMod, type FROM discussion , user, etudiant, section, module, typeModule WHERE (discussion.personneA = ? AND user.idUser = discussion.personneB AND etudiant.userID = user.idUser AND etudiant.section = section.idSec AND typeModule.enseignantID = ? AND typeModule.module = module.codeMod AND module.secID = section.idSec) OR (discussion.personneB = ? AND user.idUser = discussion.personneA AND etudiant.userID = user.idUser AND etudiant.section = section.idSec AND typeModule.enseignantID = ? AND typeModule.module = module.codeMod AND module.secID = section.idSec) group by login`
            connection.query(req, [myID, myID, myID, myID], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
                
                req = `SELECT specialite, niveau, module.nom, codeMod FROM discussion , user, etudiant, section, module, typeModule WHERE (discussion.personneA = ? AND user.idUser = discussion.personneB AND etudiant.userID = user.idUser AND etudiant.section = section.idSec AND typeModule.enseignantID = ? AND typeModule.module = module.codeMod AND module.secID = section.idSec) OR (discussion.personneB = ? AND user.idUser = discussion.personneA AND etudiant.userID = user.idUser AND etudiant.section = section.idSec AND typeModule.enseignantID = ? AND typeModule.module = module.codeMod AND module.secID = section.idSec) group by section.idSec`
                connection.query(req, [myID, myID, myID, myID], function(err, result2, fields){
                    if(err){
                        console.log(err.message);
                    }
                    socket.emit("getDMs", [result, myID, result2])
                })


            })
        })
    })
    
    socket.on("getNotes", (token) =>{ 

        req = `SELECT note.* FROM note, user, etudiant WHERE token = ? AND idUser = userID AND etudiant.matricule = note.matricule`
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getNotes", result)
        })
        
    })

    socket.on("getNotesE", (token) =>{ 

        req = `Select etu.login, title, moyenne, max, module.nom, module.codeMod from note, user ens, user etu, etudiant, module, typeModule WHERE ens.token = ? AND typeModule.enseignantID = ens.idUser AND typeModule.module = module.codeMod AND note.codeMod = module.codeMod AND etudiant.userID = etu.idUser AND etudiant.matricule = note.matricule GROUP BY login, title`
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getNotesE", result)
        })
        
    })

    socket.on("saveNotes", (data) => {
        methode = data[0]
        notes = data[1]
        codeMod = data[2]

    })

    socket.on("getEDT", (token) => {
        req = `SELECT edtFile FROM emploiDuTemps, user, etudiant WHERE token = ? and idUser = userID and etudiant.section = emploiDuTemps.section`
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length == 0){
                socket.emit("getEDT", "empty")
            }else{
                socket.emit("getEDT", readEDT(result[0]["edtFile"]))
            }

        })
    })

    socket.on("getEDTADM", (sec) => {
        req = `SELECT edtFile FROM emploiDuTemps WHERE section = ?`
        connection.query(req, [sec], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length == 0){
                socket.emit("getEDTADM", "empty")
            }else{
                socket.emit("getEDTADM", readEDT(result[0]["edtFile"]))
            }

        })
    })

    socket.on("getExam", (data)=>{
        token = data[0]
        exam = data[1]

        req = `SELECT examens.*, login, module.nom, coef FROM examens, typeModule, user, module where examens.url = ? AND examens.typeMod = typeModule.typeID AND typeModule.enseignantID = user.idUser AND typeModule.module = module.codeMod`
        connection.query(req, [exam], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            req = `SELECT * FROM questions where questions.exam = ?`
            connection.query(req, [result[0].exam_id], function(err, result2, fields){
                if(err){
                    console.log(err.message);
                }

                socket.emit("getExam", [result, result2])
            
            })
        })

    })

    socket.on("addCompte", (data) => {
        //if the password have at least 8 characters and 1 uppercase and 1 number
        if(data[7].length >= 8 && data[7].match(/[A-Z]/) && data[7].match(/[a-z]/) && data[7].match(/[0-9]/) && !data[7].includes(data[0]) && !data[7].includes(data[1])){
            nom = data[0]
            prenom = data[1]
            login = nom.toLowerCase() + "." + prenom.toLowerCase()
            section = parseInt(data[2])
            mail = data[3]
            matricule = data[4]
            grp = data[5]
            role = data[6] == 1 ? "etudiant" : "enseignant"
            password = data[7]
            file = data[8]
            fb = Buffer.from(file, 'base64');
    
            bcrypt.hash(password, salt, function(err, hash) {
    
                data = [login, hash, nom, prenom, mail, role, fb]
        
                req = `INSERT INTO user (login, password, nom, prenom, email, role, photo) VALUES (?,?,?,?,?,?,?)`
                connection.query(req, data, function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    if(role == "etudiant"){
                        req = `INSERT INTO etudiant (matricule, userID, section, groupe) VALUES (?,?,?,?)`
                        connection.query(req, [matricule, result.insertId, section, grp], function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
                        })
                    }
                })
            })
        }else{
            setTimeout(function(){
                socket.emit("addCompte", "error")
            }
            , 1500);
        }
    })

    socket.on("changePDP", (data) => {
        token = data[0]
        file = data[1]
        fb = Buffer.from(file, 'base64');
        req = "UPDATE user SET photo = ? WHERE token = ?"
        connection.query(req, [fb, token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
        })
        socket.emit("success", 1)
    })

    socket.on("changeInfo", (data) =>{
        token = data[0]
        num = data[1]
        mail = data[2]
        pass = data[3]
        newPass = data[4]
        if(newPass != ""){
            if(newPass.length < 8 || !newPass.match(/[A-Z]/) || !newPass.match(/[a-z]/) || !newPass.match(/[0-9]/)){
                socket.emit("success", 0)
                return
            }
        }
        
        req = "SELECT password FROM user WHERE token = ?"
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            bcrypt.compare(pass, result[0].password, function(err, res) {
                if(res){
                    if(newPass != ""){
                        bcrypt.hash(newPass, salt, function(err, hash) {
                            req = "UPDATE user SET password = ? WHERE token = ?"
                            connection.query(req, [hash, token], function(err, result, fields){
                                if(err){
                                    console.log(err.message);
                                }
                                socket.emit("success", 1)
                            })
                        })
                    }

                    if(mail || num ){ 
                        req = `UPDATE user SET ${mail ? "email = ?" : ""} ${num ? `${mail? ",":""} phone = ?`: ""} WHERE token = ?`
                        data = mail && num ? [mail, num] : mail ? [mail] : [num]
                        data.push(token)
                        connection.query(req, data, function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
                            socket.emit("success", 1)
                        })
                    }else if(newPass == ""){
                        socket.emit("success", 0)
                    }

                }else{
                    socket.emit("success", 0)
                }
            })
        })
                    


        
    })

    socket.on("dolSend", (data)=>{
        token = data[0]
        title = data[1]
        content = data[2]

        req = "SELECT idUser FROM user WHERE token = ?"
        connection.query(req, [token], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            req = "INSERT INTO doleances (etudiant, titre, content, date) VALUES (?,?,?,DATE_SUB(NOW(), INTERVAL 1 HOUR))"
            connection.query(req, [result[0].idUser, title, content], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
            })
        })


    })

    socket.on("getDoleances", ()=>{
        req = "SELECT user.nom, user.prenom, etudiant.matricule, section.specialite, section.niveau, doleances.date, doleances.titre, doleances.content, doleances.dol_id FROM doleances, etudiant, user, section WHERE user.idUser = etudiant.userID AND etudiant.section = section.idSec AND doleances.etudiant = user.idUser"
        connection.query(req, function(err, result, fields){
            if(err){
                console.log(err.message);
            }

            socket.emit("getDoleances", result)
        })
    })

    socket.on("deleteDoleance", (id)=>{
        req = "DELETE FROM doleances WHERE dol_id = ?"
        connection.query(req, [id], function(err, result, fields){
            if(err){
                console.log(err.message);
            }

        })
    })

    socket.on("addNote", (data) => { 
        module = data.module
        title = data.title
        noteMax = data.noteMax
        methode = data.methode
        req = "SELECT matricule FROM etudiant, module WHERE etudiant.section = module.secID AND module.codeMod = ?"
        connection.query(req, [module], function(err, matricules, fields){
            if(err){
                console.log(err.message);
            }
            matricules.forEach(matricule => {
                req = "INSERT INTO note (codeMod, matricule, title, max, methode, edited) VALUES (?,?,?,?,?, DATE_SUB(NOW(), INTERVAL 1 HOUR))"
                connection.query(req, [module, matricule.matricule, title, noteMax, methode], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }else{
                        socket.emit("success", 1)
                    }
                })
            });
        })

    })
    socket.on("updateNotes", (names, maxs, mod) => {
        names.forEach(name => {
            req = `UPDATE note SET title = ? WHERE title = ? AND max = ? AND codeMod = ?`
            connection.query(req, [name[1], name[0], name[2], mod], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
            })
        })
        maxs.forEach(max => {
            req = `UPDATE note SET max = ? WHERE max = ? AND title= ? AND codeMod = ?`
            connection.query(req, [max[1], max[0], max[2], mod], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
            })
        })
        socket.emit("success", 1)

    })

    socket.on("getMethode", module => {
        req = "SELECT title, methode FROM note WHERE codeMod = ? group by title order by methode desc"
        connection.query(req, [module], function(err, result, fields){
            console.log(result);
            if(err){
                console.log(err.message);
            }
            if(result.length > 0){
                socket.emit("getMethode", result[0].methode, result)
            }
            
        })
    })
    socket.on("addMethode", (methode, module) => {
        req = "UPDATE note SET methode = ? WHERE codeMod = ?"
        console.log(`UPDATE note SET methode = ${methode} WHERE codeMod = ${module}`);
        connection.query(req, [methode, module], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("success", 1)
        })
    })

    socket.on("getEtudiants", (module, title)=>{
        req = "SELECT nom, prenom, photo, etudiant.matricule, note.* FROM user, etudiant, note WHERE user.idUser = etudiant.userID AND etudiant.matricule = note.matricule AND note.codeMod = ? AND title = ?"
        connection.query(req, [module, title], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length > 0){
                socket.emit("getEtudiants", result)
            } else if (title == "GENERALE"){
                req = "SELECT matricule FROM etudiant WHERE section = (SELECT secID FROM module WHERE codeMod = ?)"
                connection.query(req, [module], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    req = "INSERT INTO note (codeMod, matricule, title, max) VALUES (?,?,?,?)"
                    result.forEach(matricule => {
                        connection.query(req, [module, matricule.matricule, title, 20], function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
                        })
                    });
                    req2 = "SELECT nom, prenom, photo, etudiant.matricule, note.* FROM user, etudiant, note WHERE user.idUser = etudiant.userID AND etudiant.matricule = note.matricule AND note.codeMod = ? AND title = ?"
                    connection.query(req2, [module, title], function(err, result, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result.length > 0){
                            socket.emit("getEtudiants", result)
                        }
                    })
                })
            }
            
        })
    })

    socket.on("editNotes", (data)=>{

        data.forEach(element => {
            module = element[0]
            matricule = element[1]
            note = element[2]
            title = element[3]
            methode = element[4]

            req = "UPDATE note SET moyenne = ? WHERE codeMod = ? AND matricule = ? AND title = ? AND methode = ?"
            connection.query(req, [note, module, matricule, title, methode], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
                req = `UPDATE note SET edited = DATE_SUB(NOW(), INTERVAL 1 HOUR) WHERE codeMod = ? AND matricule = ? AND title = ? AND methode = ?`
                connection.query(req, [module, matricule, title, methode], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    socket.emit("success", 1)
                })
            }
            )}
        )}
    )

    socket.on("getAdminSections", () => {
        connection.query("SELECT * FROM section ORDER BY niveau, specialite", function(err, result1, fields){
            
            if(err){
                console.log(err.message);
            }
            if(result1.length > 0){
                socket.emit('getAdminSections', result1);
            }
            
        })

    })

    socket.on("getSectionData", (sectionID) => {
        //variable names start with the current time to calculate the time passed
        //start = new Date().getTime();
        //console.log("got");
        connection.query("SELECT * FROM section WHERE idSec = ?", [sectionID], function(err, result1, fields){
            //console.log(`0 ${new Date().getTime() - start}`);
            //start = new Date().getTime();
            if(err){
                console.log(err.message);
            }
            if(result1.length > 0){
                connection.query("SELECT codeMod, enseignantID, type FROM module, typeModule WHERE secID = ? AND module = codeMod order by nom, type", [sectionID], function(err, result3, fields){
                    //console.log(`1 ${new Date().getTime() - start}`);
                    //start = new Date().getTime();
                    if(err){
                        console.log(err.message);
                    }
                    connection.query("SELECT codeMod, nom FROM module WHERE secID = ? group by nom", [sectionID], function(err, result2, fields){
                        //console.log(`2 ${new Date().getTime() - start}`);
                        //start = new Date().getTime();
                        if(err){
                            console.log(err.message);
                        }
                        connection.query("SELECT COUNT(*) AS nbEtudiants FROM etudiant WHERE section = ?", [sectionID], function(err, result4, fields){
                            //console.log(`3 ${new Date().getTime() - start}`);
                            //start = new Date().getTime();
                            if(err){
                                console.log(err.message);
                            }
                            connection.query("SELECT COUNT(*) as nbProf FROM (SELECT * FROM module, typeModule WHERE module.secID = ? AND codeMod = module group by enseignantID) AS sous_calc", [sectionID], function(err, result5, fields){
                                //console.log(`4 ${new Date().getTime() - start}`);
                                //start = new Date().getTime();
                                if(err){
                                    console.log(err.message);
                                }
                                connection.query("SELECT idUser, nom, prenom FROM user WHERE role = 'enseignant' order by nom", [], function(err, result6, fields){
                                    if(err){
                                        console.log(err.message);
                                    }
                                    //console.log("emit");
                                    socket.emit('getSectionData', [result1[0], result2, result3, result4[0], result5[0], result6]);
                                })
                                
                            });
                            
                        })

                    })
                    
                })
            }
            
        })

    })

    socket.on("getLsEnseignants", () => {
        req = "SELECT * FROM user WHERE role = 'enseignant' ORDER BY nom"
        connection.query(req, [], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            if(result.length > 0){
                socket.emit("getLsEnseignants", result)
            }
        })
    })

    socket.on("adminEditModules", data =>{
        
        types = ["cours", "td", "tp"]
        toEdit = data[0]
        toDel = data[1]
        toAdd = data[2]

        toEdit.forEach(element => {
            if(element[2] == "#"){
                connection.query("DELETE FROM typeModule WHERE module = ? AND type = ?", [element[0], element[1]], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                })
            }else{
                connection.query("SELECT * FROM typeModule WHERE module = ? AND type = ?", [element[0], element[1]], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    if(result.length > 0){
                        req = "UPDATE typeModule SET enseignantID = ? WHERE module = ? AND type = ?"
                    }else{
                        req = "INSERT INTO typeModule (enseignantID, module, type) VALUES (?, ?, ?)"
                    }
                    connection.query(req, [element[2], element[0], element[1]], function(err, result, fields){
                        
                        if(err){
                            console.log(err.message);
                        }
                    })
                })
            }
        })
        toDel.forEach(element => {
            req = "DELETE FROM typeModule WHERE module = ?"
            connection.query(req, [element], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }

                req = "DELETE FROM note WHERE codeMod = ?"
                connection.query(req, [element], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    req = "DELETE FROM postes WHERE codeModule = ?"
                    connection.query(req, [element], function(err, result, fields){
                        if(err){
                            console.log(err.message);
                        }

                        req = "DELETE FROM module WHERE codeMod = ?"
                        connection.query(req, [element], function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
        
                        })

                    })
                    
                })
                

            })
        })
        toAdd.forEach(element => {
            
            req = "INSERT INTO module (codeMod, nom, secID) VALUES (?, ?, ?)"
            connection.query(req, [element[0]+element[1], element[0], element[1]], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }

                for(var i = 2; i<5 ; i++){
                    if(element[i] != "#"){
                        req = "INSERT INTO typeModule (enseignantID, module, type) VALUES (?, ?, ?)"
                        connection.query(req, [element[i], element[0]+element[1], types[i-2]], function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
                        })
                    }
                }

            })

        })
        setTimeout(() => {
            socket.emit("success", 1)
            
        }, 1000);
    }) //[tempModules, toDelete])

    socket.on("adminEditStudents", (file, section) => {
        students = readStudentList(file)
        editListeEtudiants(students, section)
    })
    socket.on("adminEditEDT", (file, section) => {
        editEDT(file, section)
    })

    socket.on("addSection", data => { //[secName, secInd, secSpe, secFil, secAnn, etudiants, edt, modules]
        
        
        nom = data[0]
        indice = data[1]
        specialite = data[2]
        filiere = data[3]
        annee = data[4]
        etudiants = data[5]
        edt = data[6]
        modules = data[7]
        
        req = "INSERT INTO section (niveau, specialite, filliere, nom, indice) VALUES (?, ?, ?, ?, ?)"
        connection.query(req, [annee, specialite, filiere, nom, indice], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            idSec = result.insertId
            if(etudiants != undefined){
                addListeEtudiants(readStudentList(etudiants), idSec)
            }
            if(edt != undefined){
                editEDT(edt, idSec)
            }
            var types = ["cours", "td", "tp"]
            modules.forEach(element => {
                connection.query(`INSERT INTO module (codeMod, nom, secID) VALUES ("${element[0]+idSec}", "${element[0]}", "${idSec}")`, function(err, result, fields){

                    if(err){
                        console.log(err.message);
                    }
                    for(var i = 2; i<5 ; i++){
                        console.log(element[i])
                        if(element[i] != "#"){
                            console.log(`INSERT INTO typeModule (enseignantID, module, type) VALUES ("${element[i]}", "${element[0]+idSec}", "${types[i-2]}")`);
                            connection.query(`INSERT INTO typeModule (enseignantID, module, type) VALUES ("${element[i]}", "${element[0]+idSec}", "${types[i-2]}")`, function(err, result, fields){
                                if(err){
                                    console.log(err.message);
                                }
                            })
                        }
                    }
                })

            });

        })
        socket.emit("success", 1, 1)
    })

    socket.on("dlEtudiants", section => {
        req = "SELECT matricule, groupe FROM etudiant WHERE section = ?"
        connection.query(req, [section], function(err, result, fields){
            if(err){
                console.log(err.message);
            }

            console.log(readStudentList(createStudentsFile(result)));
            socket.emit("dlEtudiants", createStudentsFile(result))
        })
    })

    socket.on("dlEDT", section => {
        req = "SELECT edtFile FROM emploiDuTemps WHERE section = ?"
        connection.query(req, [section], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("dlEDT", result[0])
        })
    })

    socket.on("getListeEtudiants", () => {
        req = "SELECT user.*, etudiant.*, section.nom as sectionNom FROM user, etudiant, section WHERE user.idUser = etudiant.userID AND etudiant.section = section.idSec"
        connection.query(req, [], function(err, result1, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getListeEtudiants", result1)
        })
    })
    //socket.on("getListeEtudiantsEns", (cookies) => { 
    //    var token
    //    cookies = cookie[0].split('; ')
    //    cookies.forEach(function(c){
    //        if(c.startsWith('token=')){
    //            token = c.split('=')[1]
    //        }
    //    })
    //    req = "SELECT * FROM section, etudiants WHERE section.idSec = etudiants.section AND etudiants.token = ?"
    //})

    socket.on("removeStudent", (matricule) => {
        req = "UPDATE etudiant SET section = 0 WHERE matricule = ?"
        connection.query(req, [matricule], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
        })
    })

    socket.on("suprimerSection", section => { 
        console.log("suprimerSection");
        req = "UPDATE etudiant SET section = 0 WHERE section = ?"
        connection.query(req, [section], function(err, result, fields){
            
            if(err){
                console.log(err.message);
            }
            req = "DELETE FROM typeModule WHERE module IN (SELECT codeMod FROM module WHERE secID = ?);"
            connection.query(req, [section], function(err, result, fields){
                
                if(err){
                    console.log(err.message);
                }
                req = "DELETE FROM postes WHERE codeModule IN (SELECT codeMod FROM module WHERE secID = ?);"
                connection.query(req, [section], function(err, result, fields){
                    
                    if(err){
                        console.log(err.message);
                    }
                    req = "DELETE FROM module WHERE secID = ?;"
                    connection.query(req, [section], function(err, result, fields){
                        if(err){
                            console.log(err.message);
                        }
                        req = "DELETE FROM emploiDuTemps WHERE section = ?;"
                        connection.query(req, [section], function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
                            req = "DELETE FROM section WHERE idSec = ?;"
                            connection.query(req, [section], function(err, result, fields){
                                if(err){
                                    console.log(err.message);
                                }
                                socket.emit("success", 1)
                            })
                        })
                    })
                })
            
            })
        })
    })
    socket.on("getEns", () => {
        req = "SELECT * FROM user WHERE role = 'enseignant' order by nom"
        connection.query(req, [], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getEns", result)
        })
    })
    socket.on("removeTeacher", id => {
        console.log(`DELETE FROM typeModule WHERE enseignantID = ${id}`);
        req = "DELETE FROM typeModule WHERE enseignantID = ?"
        connection.query(req, [id], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            console.log(`SELECT * FROM postes WHERE ensID = ${id}`);
            req = "SELECT * FROM postes WHERE ensID = ?"
            connection.query(req, [id], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
                result.forEach(element => {
                    console.log(`DELETE FROM commentaires WHERE postID = ${element.postID}`);
                    req = "DELETE FROM commentaires WHERE postID = ?"
                    connection.query(req, [element.postID], function(err, result, fields){
                        if(err){
                            console.log(err.message);
                        }
                        console.log(`DELETE FROM postes WHERE postID = ${element.postID}`);
                        req = "DELETE FROM postes WHERE postID = ?"
                        connection.query(req, [element.postID], function(err, result, fields){
                            if(err){
                                console.log(err.message);
                            }
                        })
                    })
                });
                console.log(`DELETE FROM message WHERE sender = ${id}`);
                req = "DELETE FROM message WHERE sender = ?"
                connection.query(req, [id], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                    console.log(`DELETE FROM user WHERE idUser = ${id} AND role = 'enseignant'`);
                    req = "DELETE FROM user WHERE idUser = ? AND role = 'enseignant'"
                    connection.query(req, [id], function(err, result, fields){
                        if(err){
                            console.log(err.message);
                        }
                        socket.emit("success", 1)
                        console.log("fin");
                    })
                })

            })
            
        })
        
    })
    socket.on("addProf", data => { // data format [nom, prenom, phone, email]

        mdp = generateCode(10)
        console.log(mdp);
        envoyerMail(data[3], "Un compte enseignant a été créé", "Un administrateur a créé un compte enseignant pour vous. Votre mot de passe est: " + mdp)
        
        bcrypt.hash(mdp, 14, function(err, hash) {
            
            req = "INSERT INTO user (nom, prenom, phone, email, password, login, role) VALUES (?, ?, ?, ?, ?, ?, 'enseignant')"
            connection.query(req, [data[0], data[1], data[2], data[3], hash, `${data[0].toLowerCase()}.${data[1].toLowerCase()}`], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
                socket.emit("success", 1)
            })
        })


    })
    //socket.on("disconnecting", () => {
    //    login = [...socket.rooms][1]
    //    timeouts[[...socket.rooms][1]] = setTimeout(() => {
    //        req = "UPDATE user SET token = '' WHERE login = ?"
    //        //sockets rooms: 2nd value = login
    //        connection.query(req, [login], function(err, result, fields){
    //            if(err){
    //                console.log(err.message);
    //            }
    //        })
    //    }, 1000*30);
    //    console.log(timeouts);
    //})
    
});


http.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);


function readEDT(file){
    const xlsx = require('xlsx');
    const fs = require('fs');
    const start = "A1"
    const end = "F6"
    var EDT = []

    const workbook = xlsx.read(file, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const range = xlsx.utils.decode_range(start+":"+end);
    for (let row = range.s.r; row <= range.e.r; row++) {
        var ligne = []
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
            const cellValue = sheet[cellAddress]? sheet[cellAddress].v : "///";
            ligne.push(cellValue)
        }
        EDT.push(ligne)
    }
    return EDT
}

function readStudentList(file) {
    const xlsx = require('xlsx');
    const fs = require('fs');
    const start = "A2";
    const end = "B9999"; // Assurez-vous d'ajuster le numéro de ligne maximum selon vos besoins
    var studentList = [];

    const workbook = xlsx.read(file, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const range = xlsx.utils.decode_range(start + ":" + end);
    for (let row = range.s.r; row <= range.e.r; row++) {
        var student = {};
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
            const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : "";
            if (col === 0) {
                student.matricule = cellValue;
            } else if (col === 1) {
                student.groupe = cellValue;
            }
        }
        if(student.matricule == "" && student.groupe == "") break;
        studentList.push(student);
    }
    return studentList;
}

function envoyerMail(to, titre, content){
    // Définir les options de l'e-mail
    let mailOptions = {
        from: 'SuperEntUSTHB@hotmail.com',
        to: to,
        subject: titre,
        text: content
    };

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        }
    });
}

function generateToken(existant){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 20; i++) { token += characters.charAt(Math.floor(Math.random() * characters.length)); }
    while(existant.includes(token)){
        token = ''
        for (let i = 0; i < 20; i++) { token += characters.charAt(Math.floor(Math.random() * characters.length)); }
    }
    return token
}

function generateCode(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 8; i++) { token += characters.charAt(Math.floor(Math.random() * characters.length)); }
    
    return token
}
function generateMDP(){
    const maj = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const min = 'abcdefghijklmnopqrstuvwxyz';
    const num = '0123456789';
    let token = '';

    for (let i = 0; i < 4; i++) { token += maj.charAt(Math.floor(Math.random() * maj.length));}
    for (let i = 0; i < 4; i++) { token += min.charAt(Math.floor(Math.random() * min.length));}
    for (let i = 0; i < 4; i++) { token += num.charAt(Math.floor(Math.random() * num.length));}

    return token
}


function addListeEtudiants(liste, section){
    liste.forEach(etudiant => { // {matricule, groupe}
        console.log(etudiant);
        connection.query("SELECT * FROM etudiant WHERE matricule = ?", [etudiant.matricule], function(err, result1, fields){
            if(err){
                console.log(err.message);
            }
            if(result1.length > 0){ // etudiant existe dans les etudiants
                console.log("existe");
                connection.query("DELETE FROM note WHERE matricule = ?", [etudiant.matricule], function(err, result2, fields){
                    console.log("ne7i les notes");
                    if(err){ // del des notes
                        console.log(err.message);
                    }
                    connection.query("UPDATE etudiant SET section = ?, groupe = ? WHERE matricule = ?", [section, etudiant.groupe, etudiant.matricule], function(err, result3, fields){
                        console.log("update l'etudiant");
                        if(err){ // update etudiant
                            console.log(err.message);
                        }
                        
                    })
                })
            }
        })
        

    })
}

function editListeEtudiants(liste, section){
    req = "SELECT * FROM etudiant WHERE section = ?"
    connection.query(req, [section], function(err, result, fields){
        if(err){
            console.log(err.message);
        }
        result.forEach(etudiant => {
            found = false
            liste.forEach(etudiant2 => {
                if(etudiant.matricule == etudiant2.matricule){
                    found = true
                    req = "UPDATE etudiant SET groupe = ? WHERE matricule = ?"
                    connection.query(req, [etudiant2.groupe, etudiant2.matricule], function(err, result, fields){
                        if(err){
                            console.log(err.message);
                        }
                    })
                    
                }
            })
            if(!found){
                req = "UPDATE etudiant SET groupe = '', section = 0 WHERE matricule = ?"
                connection.query(req, [etudiant.matricule], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                })
            }
        })
        liste.forEach(etudiant => {
            found = false
            result.forEach(etudiant2 => {
                if(etudiant.matricule == etudiant2.matricule){
                    
                    found = true
                    
                }
            })
            if(!found){
                req = "UPDATE etudiant SET groupe = ?, section = ? WHERE matricule = ?"
                connection.query(req, [etudiant.groupe, section, etudiant.matricule], function(err, result, fields){
                    if(err){
                        console.log(err.message);
                    }
                })
            }
        })
        
    })
}

function editEDT(file, section){

    req = "SELECT * FROM emploiDuTemps WHERE section = ?"
    connection.query(req, [section], function(err, result, fields){
        if(err){
            console.log(err.message);
        }

        if(result.length > 0){
            req = "UPDATE emploiDuTemps SET edtFile = ?WHERE section = ?"
            connection.query(req, [file, section], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
            })
        }else{
            req = "INSERT INTO emploiDuTemps (section, edtFile) VALUES (?, ?)"
            connection.query(req, [section, file], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
            })
        }

    })

}



function createStudentsFile(data) {
    const xlsx = require('xlsx');
    const fs = require('fs');

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);

    const headerRow = ['matricule', 'groupe'];
    const headerRange = xlsx.utils.decode_range(worksheet['!ref']);
    const headerAddress1 = xlsx.utils.encode_cell({ r: headerRange.s.r, c: headerRange.s.c });
    const headerAddress2 = xlsx.utils.encode_cell({ r: headerRange.s.r, c: headerRange.s.c + 1 });
    worksheet[headerAddress1] = { v: headerRow[0] };
    worksheet[headerAddress2] = { v: headerRow[1] };

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    return excelBuffer;
}
  
