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

const nodemailer = require('nodemailer');

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

        connection.query("SELECT * FROM user WHERE login = ?", [username], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
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
    }
    res.sendFile(path.join(__dirname, 'public/html/main.html'));
});
app.get('/files', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Fichiers.html'));
});
app.get('/msg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/msgSection.html'));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Notes.html'));
})
app.get("/edt", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/EDTpage.html'));
})
app.get("/examen*", (reqs, res) => {
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
                
                console.log(verifCode);
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
                    res.redirect("/login");
                })
            })
            
        }
        
    }else{
        res.sendFile(path.join(__dirname, 'public/html/pwdForgot.html'));
    }

    
})
app.get("/pagePersonelle", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/pagePerso.html'));
})
app.get("/Admin_Doleances", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/Admin_Doleances.html'));
})
app.get("/listeEtudiants", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/listeEtudiants.html'));
})
app.get("/disconnect", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
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
                    connection.query("SELECT login, nom, prenom, photo, niveau, specialite, idSec FROM user, etudiant, section WHERE user.idUser=etudiant.userID AND etudiant.section=section.idSec AND user.token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            console.log("+ student connected> " + result1[0]["login"]);
                            socket.join(result1[0]["login"])
                            socket.join(String(result1[0]["idSec"]))
                            connection.query("SELECT nom, codeMod FROM module WHERE secID=?", [result1[0]["idSec"]], function(err, result2, fields){
                                if(err){
                                    console.log(err.message);
                                }
                                if(result2.length > 0){
                                    connection.query("SELECT codeMod, type, login FROM module, typeModule, user WHERE secID=? AND typeModule.module = module.codeMod AND typeModule.enseignantID = user.idUser", [result1[0]["idSec"]], function(err, result3, fields){
                                        if(err){
                                            console.log(err.message);
                                        }
                                        socket.emit('connectedEtu', [result1[0], result2, result3]);
                                    })
                                }
                            })
                        }
                    })
                }
                //enseignant
                else if(role == "enseignant"){
                    connection.query("SELECT login, user.nom, prenom, photo, idUser FROM user WHERE token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            console.log("+ teacher connected> " + result1[0]["login"]);
                            socket.join(result1[0]["login"])
                            connection.query("SELECT idSec, module.nom, niveau, specialite, codeMod, type FROM module, section, typeModule WHERE typeModule.module = module.codeMod AND enseignantID = ? AND module.secID = section.idSec group by codeMod", [result1[0]["idUser"]], function(err, result2, fields){
                                
                                if(err){
                                    console.log(err.message);
                                }
                                if(result2.length > 0){
                                    if(result2.length > 0){
                                        connection.query("SELECT codeMod, type, login FROM module, typeModule, user WHERE secID=? AND typeModule.module = module.codeMod AND typeModule.enseignantID = user.idUser", [result1[0]["idSec"]], function(err, result3, fields){
                                            if(err){
                                                console.log(err.message);
                                            }
                                            socket.emit('connectedEns', [result1[0], result2, result3]);
                                        })
                                    }
                                }
                                
                            })
                        }
                    })
                }

            }

        })
    
    }); // TODO: je dois travailler sur EDT + travaux actuels

    socket.on("getPosts", (data) => {
        args = []
        if(data[0] == "General"){
            req = `
            SELECT prf.login, postes.contenu, postes.postID, postes.PJ_lens, postes.PJ_names, module.nom, type, postes.date, postes.comm, postes.traveauRendre
            FROM user etu, user prf, postes, module, etudiant
            WHERE
            etu.token = "${data[1]}" AND
            etudiant.userID = etu.idUser AND
            postes.codeModule = module.codeMod AND
            module.secID = etudiant.section AND
            prf.idUser = postes.ensID

            group by postID 
            order by postes.date DESC
            `
        }else{
            req = `
            SELECT prf.login, postes.contenu, postes.postID, postes.PJ_lens, postes.PJ_names, module.nom, type, postes.date, postes.comm, postes.traveauRendre
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
        req = `SELECT prf.login, module.nom, contenu, type, postID, PJ_lens, PJ_names, date, comm, traveauRendre 
        FROM user prf, module, postes
        WHERE
        
        prf.token = ? AND
        prf.idUser = postes.ensID AND
        postes.codeModule = module.codeMod AND
        module.secID = ? AND
        module.nom = ?
        
        order by postes.date DESC`
        connection.query(req, [profToken, secID, module], function(err, result, fields){
            if(err){
                console.log(err.message);
            }
            socket.emit("getPostsE", result);
        })
    });

    socket.on("setPost", (data) => {
        req = "INSERT INTO `postes`(`contenu`, `ensID`, `codeModule`, `PJ`, `PJ_lens`, `PJ_names`, `comm`, `traveauRendre`, `type`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        
        files = data[4]
        buffers = []
        lens = ""
        names = ""
        comm = data[7]
        travb = data[8]
        type = data[9]
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
        connection.query(req, [data[2], data[1], data[3], combinedBuffer, lens, names, comm ? 1:0, travb ? 1:0, type], function(err, result, fields){
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
            req = `SELECT postes.PJ_lens, postes.PJ_names, postID FROM postes, user ens, module, etudiant WHERE ens.token = ? AND ens.idUser = etudiant.userID AND module.codeMod = postes.codeModule AND module.secID = etudiant.section AND NOT PJ = ""`
        }else{
            req = `SELECT postes.PJ_lens, postes.PJ_names, postID FROM postes, user ens, module, etudiant WHERE ens.token = ? AND ens.idUser = etudiant.userID AND module.codeMod = postes.codeModule AND module.secID = etudiant.section AND NOT PJ = "" AND module.nom = '${module}'`
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
        req = `SELECT postes.PJ_lens, postes.PJ_names, postID FROM postes, module WHERE module.nom = '${module}' AND module.secID = '${secID}' AND module.codeMod = postes.codeModule`
        
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
});


http.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);


//config start end
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

