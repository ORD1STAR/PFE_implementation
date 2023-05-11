const express = require('express');
const path = require('path')
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql')
const crypto = require('crypto')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

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

        connection.query("SELECT * FROM user WHERE login = ? AND password = ?", [username, password], function(err, result, fields){
            if(err){
                console.log(err.message);
            }

            if(result.length > 0){
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
    }else{
        res.sendFile(path.join(__dirname, 'public/html/login.html'));
    }
    
});
app.get('/home', (req, res) => {
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
                    connection.query("SELECT login, niveau, specialite, idSec FROM user, etudiant, section WHERE user.idUser=etudiant.userID AND etudiant.section=section.idSec AND user.token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            console.log("+ student connected> " + result1[0]["login"]);
                            socket.join(result1[0]["login"])
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
                    connection.query("SELECT login, idUser FROM user WHERE token = ?", [token], function(err, result1, fields){
                        if(err){
                            console.log(err.message);
                        }
                        if(result1.length > 0){
                            console.log("+ teacher connected> " + result1[0]["login"]);
                            socket.join(result1[0]["login"])
                            connection.query("SELECT idSec ,nom, niveau, specialite, codeMod, type FROM module, section, typeModule WHERE typeModule.module = module.codeMod AND enseignantID = ? AND module.secID = section.idSec group by codeMod", [result1[0]["idUser"]], function(err, result2, fields){
                                
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
        profToken = data[0].split('=')[1];
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
        
        
        connection.query(req, [token, secID, module], function(err, result, fields){
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

    socket.on("showComms", (postID) => {
        req = "SELECT content, login FROM commentaires, user WHERE commentaires.postID = ? AND user.idUser = commentaires.sender order by date DESC"
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
            req = `SELECT idUser FROM user WHERE login = ?`
            connection.query(req, [login], function(err, hisID, fields){
                if(err){
                    console.log(err.message);
                }
                hisID = hisID[0]["idUser"]
                
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
                            socket.emit("getChat", ["empty", result.insertId])
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
                               socket.emit("getChat", ["empty", discussion[0]["discussionID"]])
                            }else{
                                socket.emit("getChat", [result, myID])
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

            req = `SELECT discussionID, login, specialite, niveau, nom, codeMod, type FROM discussion , user, etudiant, section, module, typeModule WHERE (discussion.personneA = ? AND user.idUser = discussion.personneB AND etudiant.userID = user.idUser AND etudiant.section = section.idSec AND typeModule.enseignantID = ? AND typeModule.module = module.codeMod AND module.secID = section.idSec) OR (discussion.personneB = ? AND user.idUser = discussion.personneA AND etudiant.userID = user.idUser AND etudiant.section = section.idSec AND typeModule.enseignantID = ? AND typeModule.module = module.codeMod AND module.secID = section.idSec) group by login`
            connection.query(req, [myID, myID, myID, myID], function(err, result, fields){
                if(err){
                    console.log(err.message);
                }
                
                req = `SELECT specialite, niveau, nom, codeMod FROM discussion , user, etudiant, section, module, typeModule WHERE (discussion.personneA = ? AND user.idUser = discussion.personneB AND etudiant.userID = user.idUser AND etudiant.section = section.idSec AND typeModule.enseignantID = ? AND typeModule.module = module.codeMod AND module.secID = section.idSec) OR (discussion.personneB = ? AND user.idUser = discussion.personneA AND etudiant.userID = user.idUser AND etudiant.section = section.idSec AND typeModule.enseignantID = ? AND typeModule.module = module.codeMod AND module.secID = section.idSec) group by section.idSec`
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

        req = `Select etu.login, title, moyenne, max, nom, module.codeMod from note, user ens, user etu, etudiant, module, typeModule WHERE ens.token = ? AND typeModule.enseignantID = ens.idUser AND typeModule.module = module.codeMod AND note.codeMod = module.codeMod AND etudiant.userID = etu.idUser AND etudiant.matricule = note.matricule GROUP BY login, title`
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