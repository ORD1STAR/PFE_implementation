
function download(id, name) {
    socket.emit("download", [id, name])
    socket.on("Upload", (data) => {
        fileb = new Blob([data], {type: "application/txt"})
        const fileUrl = URL.createObjectURL(fileb);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', name);
        link.click()
    })
}

function writeFiles(names, lens, postID) {
    if(lens.split("/").length > 0 && lens != ""){
        lens = lens.split("/")
        names = names.split("/")
        curs = 0
    
        for(var i = 0; i < lens.length; i++) {
            curs += parseInt(lens[i])
            size = parseInt(lens[i]) <= 1024 ? parseInt(lens[i]) : (parseFloat(lens[i])/1024).toFixed(2)
            size = `${size} ${parseInt(lens[i]) < 1024 ? "octets" : (parseInt(lens[i]) < 1024*1024 ? "Ko" : "Mo")}`
            nameE = names[i].length > 10 ? names[i].slice(0, 10) + "..." : names[i]
            link = names[i].endsWith(".pdf") ? "https://fr.seaicons.com/wp-content/uploads/2015/11/pdf-icon.png" : (names[i].endsWith(".docx") ? "https://fr.seaicons.com/wp-content/uploads/2022/05/Word-icon.png" : "https://fr.seaicons.com/wp-content/uploads/2023/04/ModernXP-30-Filetype-Text-icon.png")
            document.getElementById("filesSectionMain").innerHTML += `
            <div class="file" onclick="download('${postID}', '${names[i]}')">
                <img src="${link}" alt="">
                <p class="title">${nameE}</p>
                <p class="taille">${size}</p>
                <p class="tag">Cours</p>
            </div>`
        }

    }
    
}
function setFiles(Files){
    fileDiv = document.getElementById("filesSectionMain")
    fileDiv.innerHTML = ``
    for(var file of Files){
        writeFiles(file["PJ_names"], file["PJ_lens"], file["postID"])
    }
}
function getFiles(filtre){
    token = ""
    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })
    socket.emit("getFiles", [token, filtre])
    socket.on("getFiles", (data) => {
        setFiles(data)
    })
}
function getFilesE(filtre, secID){
    nomMod = filtre.split("|")[0]
    token = ""
    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })
    socket.emit("getFilesE", [token, nomMod, secID])
    socket.on("getFilesE", (data) => {
        setFiles(data)
    })
}