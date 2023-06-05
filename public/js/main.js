function downloadFile(path) {
    socket.emit("downloadP", path)
    socket.on("UploadP", (data) => {
        fileName = data[1]
        fileb = new Blob([data[0]], {type: "application/txt"})
        const fileUrl = URL.createObjectURL(fileb);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', fileName);
        link.click()
    })
}

function setCookie(name, value, days) {
    document.cookie = `${name}=${value}; path=/`;
}
  
function addOrUpdateCookie(name, value) {
  const cookies = document.cookie.split('; ');
  let cookieExists = false;
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === name) {
      setCookie(name, value);
      cookieExists = true;
      break;
    }
  }
  if (!cookieExists) {
    setCookie(name, value);
  }
}
  

var postsVar
var limit = 10
var onMod = ""
filtresVar = [true, true, true]
var isExtending = false


// Profile SubMenu Handler







// Module Select (in menu)
modulesBtns = document.querySelectorAll('.moduleElement');
modulesBtns.forEach(moduleBtn => {
    moduleBtn.addEventListener('click', () => {
        modulesBtns.forEach(moduleBtn => {moduleBtn.classList.remove("selected_module")})
        moduleBtn.classList.add("selected_module")
    })
})



// Toggle Background

leftMenu = document.getElementById('leftMenu');
imgBtnToogleMenu = document.getElementById('imgBtnToogleMenu');
popUpBackground = document.getElementById("popUpBackground");


// Toggle Menu

function toogleMenu() {
    if (leftMenu.classList.contains('leftMenuVisible')) {
    } else {
        leftMenu.classList.add('leftMenuVisible');
        document.addEventListener('click', hideMenu);
        toggleBackground(false);
    }
}

function hideMenu(e) {
    if (!leftMenu.contains(e.target) && e.target.id != "imgBtnToogleMenu") {
        leftMenu.classList.remove('leftMenuVisible');
        document.removeEventListener('click', hideMenu)
        toggleBackground(true);
    }
}






// params menu

parametresDiv = document.getElementById('parametresDiv');
parametresDiv.addEventListener('click', showParametres);



async function showParametres() {
    let parametresPopUp = document.createElement('div')
    selected = 1
    cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === "theme") {
            if(cookie[1] == "0") {
                selected = 0
            } else if (cookie[1] == "1") {
                selected = 1
            }else if (cookie[1] == "2") {
                selected = 2
            }
            break;
        }
    }
    parametresPopUp.innerHTML = `
    
        <div class="popUpTop">
            <h3>Parametres</h3>
            <button onclick="hideParametres()">X</button>
        </div>
        <!-- <div class="parametresBodySplit">
            <div class="paramCategories">
                <button>General</button>
                <button>Affichage</button>
            </div>
            <div class="paramCore">

            </div>
        </div> -->
        <div class="parametresBody">
            <!-- <h3>Parametres généraux</h3>
            <div class="paramElement">
                <p>- Rester connecter</p>
                <input type="checkbox" id="resterConnecterCheckBox">
            </div>
            <div class="ParamSeparateur"></div> -->
            <h3>Affichage</h3>
            <div class="paramElement">
                <p>- Theme</p>
                <div class="themeSelect">
                    <button class="themeBtn${selected==0? " selectedTheme": ""}" onclick="selectTheme('0')">Foncé</button>
                    <button class="themeBtn${selected==1? " selectedTheme": ""}" onclick="selectTheme('1')">Mixte</button>
                </div>
            </div>
            <div class="paramElement">
                <p>- Bordures</p>
                <input type="range" name="" id="borderRadiusScale" min="0" max="20" oninput="updateBorderRadius(event)">
            </div>
            <div class="paramElement">
                <button id="resetParamBtn" onclick='resetParametres()'>Parametres par défaut</button>
            </div>
        </div>
    `
    document.body.appendChild(parametresPopUp);
    parametresPopUp.classList.add("popUp");
    parametresPopUp.classList.add("parametresPopup");
    await new Promise(r => setTimeout(r, 10));
    parametresPopUp.classList.add("popUpVisible");
    toggleBackground(false);
}

async function hideParametres() {
    let parametresPopUp = document.querySelector('.popUpVisible');
    parametresPopUp.classList.remove("popUpVisible");
    await new Promise(r => setTimeout(r,100));
    parametresPopUp.remove();
    toggleBackground(true);
}

var cssRoot = document.querySelector(':root');

function updateTheme(themeIndex){
    // changement theme
    if (themeIndex == 0) {
        cssRoot.style.setProperty('--background_Light', '#434656');
        cssRoot.style.setProperty('--LeftMenuBackground', '#505366');
        cssRoot.style.setProperty('--Top', 'var(--accent_Light)');

        cssRoot.style.setProperty("--textColorPureWhite", 'black');
        cssRoot.style.setProperty("--textColorPureBlack", 'white');
        cssRoot.style.setProperty("--textColorBlack", 'white');
        cssRoot.style.setProperty("--textColorWhite", '#2f3854');
        cssRoot.style.setProperty("--textColorMidWhite", 'rgba(0, 0 ,0 ,0.5)');
        cssRoot.style.setProperty("--textColorMidBlack", 'rgba(255, 255 ,255 ,0.5)');

        cssRoot.style.setProperty("--NeutralBackground", 'rgba(131, 156, 236, 0.3)');
        cssRoot.style.setProperty("--neutralBackground_ontTOP", 'rgba(255, 255 ,255 ,0.1)');

        cssRoot.style.setProperty("--important", 'var(--accent_Lighter)');
        cssRoot.style.setProperty("--important_Low", 'var(--accent_Lighter_05)');
        
        cssRoot.style.setProperty("--imgFilterBlack", '1');
        
    } else if (themeIndex == 1) {
        cssRoot.style.setProperty('--background_Light', 'rgb(241, 241, 241)');
        cssRoot.style.setProperty('--LeftMenuBackground', '#434656');
        cssRoot.style.setProperty('--Top', 'var(--LeftMenuBackground)');
        
        cssRoot.style.setProperty("--textColorPureWhite", 'white');
        cssRoot.style.setProperty("--textColorPureBlack", 'black');
        cssRoot.style.setProperty("--textColorBlack", '#2f3854');
        cssRoot.style.setProperty("--textColorWhite", 'white');
        cssRoot.style.setProperty("--textColorMidWhite", 'rgba(255, 255 ,255 ,0.5)');
        cssRoot.style.setProperty("--textColorMidBlack", 'rgba(0, 0 ,0 ,0.5)');
        
        cssRoot.style.setProperty("--NeutralBackground", 'var(--accent_Lighter_015)');
        cssRoot.style.setProperty("--neutralBackground_ontTOP", 'var(--accent_Light_01)');
        
        cssRoot.style.setProperty("--important", 'var(--accent_Light)');
        cssRoot.style.setProperty("--important_Low", 'var(--accent_Light_05)');

        cssRoot.style.setProperty("--imgFilterBlack", '0.3');
    }
}

function selectTheme(themeIndex) {
    // changement sur l'interface
    let themeBtns = document.querySelectorAll('.themeBtn');
    themeBtns.forEach(element => {
        element.classList.remove('selectedTheme');
        addOrUpdateCookie("theme", themeIndex)
    })
    themeBtns[themeIndex].classList.add('selectedTheme');
    updateTheme(themeIndex);

    
}

cookies = document.cookie.split('; ');
let cookieExists = false;
for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === "theme") {
        updateTheme(cookie[1])
        cookieExists = true;
        break;
    }
}


function updateBorderRadius(e) {
    console.log(e.target.value);
    cssRoot.style.setProperty('--common_border_radius', e.target.value + "px");
}

function resetParametres() {
    cssRoot.style.setProperty('--common_border_radius', "10px");
    selectTheme("1");
    hideParametres();
}




function refrechFiles(){
    files = document.getElementById("fileInput").files
    filesNames = []
    filesLens = []
    htmlFiled= `<button onclick="document.getElementById('fileInput').click();">+</button>`
    for(file of files){
        filesNames.push(file.name)
        filesLens.push(file.size)
    }
    for(var i = 0; i < filesNames.length; i++) {
        size = parseInt(filesLens[i]) <= 1024 ? parseInt(filesLens[i]) : (parseFloat(filesLens[i])/1024 <= 1024 ? (parseFloat(filesLens[i])/1024).toFixed(2) : (parseFloat(filesLens[i])/(1024*1024)).toFixed(2))
        size = `${size} ${parseInt(filesLens[i]) < 1024 ? "octets" : (parseInt(filesLens[i]) < 1024*1024 ? "Ko" : "Mo")}`
        htmlFiled += `
            <div class="pieceJointeElement">
                <div class="PJimg"></div>
                <div class="PJtext">
                    <p>${filesNames[i].length > 10 ? filesNames[i].slice(0, 10) + "..." : filesNames[i]}</p>
                    <p>${size}</p>
                </div>
            </div>`
    }
    document.getElementById("postPieceJointe").innerHTML = htmlFiled
    
}

function EnvoyerLePoste() {
    titre = document.getElementById("postTitle").value
    contenu = document.getElementById("postContent").value
    if(titre != "" && contenu != ""){
        contenu = "##" + titre + "##" + contenu
        files = document.getElementById("fileInput").files
        type = document.getElementsByClassName("selected_module")[0].id.split(" ")[2]
        section = document.querySelectorAll('.selected_module')[0].innerHTML.split("| ")[0].replace("<p>", "");
        secID = document.querySelectorAll('.selected_module')[0].id.split(" ")[0].replace("mod", "")
        codeMod = document.querySelectorAll('.selected_module')[0].id.split(" ")[1]
        module = document.querySelectorAll('.selected_module')[0].innerHTML.split("| ")[1].replace('</p><div class="notifDiv"></div>', "").replace("</p>", "");
        
        filesNames = [];
        filesLens = [];
        for(file of files){
            filesNames.push(file.name)
            filesLens.push(file.size)
        }
        token = ""
        cookies = document.cookie.split('; ')
        cookies.forEach(function(c){
            if(c.startsWith('token=')){
                token = c.split('=')[1]
            }
        })
        socket.emit("setPost", [token, window.ensID, contenu, codeMod, files, filesLens, filesNames, comvB, travB, type, dateTrav])
        document.getElementById("postTitle").value = ""
        document.getElementById("postContent").value = ""
        document.getElementById("fileInput").value = ""
        comvB = false
        travB = false
        getPostsE(module)
        socket.emit("newPost", [secID, module])
    }
}

socket.on("newPost", (module) => {
    selected = document.getElementsByClassName("selected_module")[0].children[0].innerHTML
    if(selected == module || selected == "General"){
        getPosts(selected) 
    }else{
        Array.from(document.getElementsByClassName("moduleElement")).forEach((e) => {
            if(e.children[0].innerHTML == module){
                e.appendChild(document.createElement("div")).className = "notifDiv"
            }
        })
        
    }
})

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
function writePoste(module, type, prof, content, postID, lens, names, date, comm, trav, deadline, role, n) {
    filtres = Array.from(document.querySelectorAll(".filterSelected"));
    let [titre, contenu] = content.split("##").filter(Boolean)
    for(var i = 0; i < filtres.length; i++) {
        filtres[i] = filtres[i].innerHTML.toLowerCase()
    }
    
    contenu = contenu.replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/g, function(url) {
        if (url.startsWith("www.")) {
          return '<a href="http://' + url + '" target="_blank">' + url + '</a>';
        } else {
          return '<a href="' + url + '" target="_blank">' + url + '</a>';
        }
      });
    
    if(filtres.includes(type)){
        pjsHTML = ""
        extended = ""
        commSec = comm == 1 ? `<button onclick="showCommentSection(${postID}, '${titre}')" class='commentSectionBtn'>Commenter</button>` : ""
        travSec = trav == 1 ? `<button class='travSectionBtn ${deadline} ${n}'>Date limite:</button>` : ""
        if(lens.split("/").length > 0 && lens != ""){
            lens = lens.split("/")
            names = names.split("/")
            
            if(lens.length > 2){
               extended = " extendedPJ" 
            }
            pjsHTML = `<div class="postPieceJointe"><h4> piéce jointes :</h4>`
            curs = 0
        
            for(var i = 0; i < lens.length; i++) {
                curs += parseInt(lens[i])
                size = parseInt(lens[i]) <= 1024 ? parseInt(lens[i]) : (parseFloat(lens[i])/1024 <= 1024 ? (parseFloat(lens[i])/1024).toFixed(2) : (parseFloat(lens[i])/(1024*1024)).toFixed(2))
                size = `${size} ${parseInt(lens[i]) < 1024 ? "octets" : (parseInt(lens[i]) < 1024*1024 ? "Ko" : "Mo")}`
                pj_extension = names[i].split(".")[1]
                pj_name = names[i].length > 10 ? names[i].slice(0, 10) + `...${pj_extension}` : names[i]
                link = names[i].endsWith(".pdf") ? "/icons/PDF.png" : (names[i].endsWith(".docx") ? "/icons/Word.png" : (names[i].endsWith(".png") || names[i].endsWith(".jpg")  ? "/icons/photo.png" :"/icons/File.png"))
                pjsHTML += `
                    <a href="" class="pieceJointeElement" id="${postID}|${names[i]}">
                    <img class="PJimg icone" src="${link}">
                        <div class="PJtext">
                            <p>${pj_name}</p>
                            <p>${size}</p>
                        </div>
                    </a>
                ` 
            }
    
            pjsHTML += `</div>`
        }
        
    
        postsDiv = document.getElementById("posts")
        dateA = date.split("T")
        dateA[1] = dateA[1].split(":")
        date = dateA[0] + " " + dateA[1][0] + ":" + dateA[1][1]
        postsDiv.innerHTML += `
        <div class="postElement" id="post${n}">
        
            <div class="postTop">
                <div class="moduleTitleDiv">
                    <h3>${module}</h3>
                    <p ${role == "admin" ? "style='color:rgb(255, 102, 102);'" : ""}>${role == "admin" ? "Administrateur:" : ""} ${prof}</p>
                </div>
                <h3 class="postTitle">${titre}</h3>
                <p class="postDate"> ${date}</p>
            </div>
            <div class="postCore${extended}">
            <div class="postText">
            <p>${contenu.replaceAll("\n","<br>")}</p>
            </div>
            <!--
            <div class="postPieceJointe">
                <h4> piéce jointes :</h4>
                <div class="pieceJointeElement">
                    <div class="PJimg"> </div>
                    <div class="PJtext">
                        <p>Série TD1 RSF 2022</p>
                        <p>2.2Mb</p>
                    </div>
                </div>
                <div class="pieceJointeElement">
                    <div class="PJimg"> </div>
                    <div class="PJtext">
                        <p>Série TD1 RSF 2022</p>
                        <p>2.2Mb</p>
                    </div>
                </div> 
            </div> 
            --> 
            ${pjsHTML}
                        </div>
                        <div class="postBottomDiv">
                        ${commSec}
                        ${travSec}
                        <!--<div class="postComment">
                        <div class="commentElement">
                        <div class="ProfileImg">
                            </div><div class="commentCore">
                            <p>{nom prénom}</p>
                            <input type="text">
                            <h3>></h3>
                        </div>
                    </div>
                </div>
                <div class="SendBtn">
                    <h3>Remettre le travail demandé</h3>
                </div> -->
            </div>
        </div>
        `
        pjB = document.querySelectorAll(".pieceJointeElement");
        pjB.forEach(pja => {
            pja.addEventListener('click', (e) => {
                e.preventDefault();
                download(pja.id.split("|")[0], pja.id.split("|")[1])
            })
        })
    
        filtreBtns = document.querySelectorAll(".filterDivB");
        filtreBtns.forEach(filtreBtn => {
            filtreBtn.addEventListener('click', () => {
                tot = 0
                filtreBtns.forEach(totaleCount => {
                        tot += totaleCount.classList.contains("filterSelected") ? 1 : 0
                })
                if(tot-1 == 0 ){
                    filtreBtn.classList.toggle("filterSelected");
                    tot = 0
                    filtreBtns.forEach(totaleCount => {
                            tot += totaleCount.classList.contains("filterSelected") ? 1 : 0
                    })
                    if(tot-1 == -1){
                        filtreBtn.classList.toggle("filterSelected");
                    } 
                }else{
                    filtreBtn.classList.toggle("filterSelected");
                }
                if(filtreBtn.classList.contains("filterSelected")){
                    if(filtreBtn.innerHTML == "Cours"){
                        filtresVar[0] = true
                    }else if(filtreBtn.innerHTML == "TD"){
                        filtresVar[1] = true
                    }else if(filtreBtn.innerHTML == "TP"){
                        filtresVar[2] = true
                    }
                }else{
                    if(filtreBtn.innerHTML == "Cours"){
                        filtresVar[0] = false
                    }else if(filtreBtn.innerHTML == "TD"){
                        filtresVar[1] = false
                    }else if(filtreBtn.innerHTML == "TP"){
                        filtresVar[2] = false
                    }
                }
                setPosts(postsVar)

                
            })
        })
    }
    // Drive, messagerie, Notes btns changing place when scroll
    optionPosts = document.querySelector('.categorieDiv');
    optionPostsHTML = optionPosts.innerHTML;

    function isVisible(element) {
        let bordures = element.getBoundingClientRect();
        return(bordures.bottom > 0)
    }

    var optionDivVisible = true;
    rightOptionPosts = document.querySelector('.rightPart .categorieDiv');

    document.addEventListener('scroll', () => {
        optionDivVisibleOLD = optionDivVisible
        optionDivVisible = isVisible(optionPosts)

        if (optionDivVisible != optionDivVisibleOLD) {
            if (optionDivVisible) {
                rightOptionPosts.classList.remove('visibleCategorieDiv')
            } else {
                rightOptionPosts.classList.add('visibleCategorieDiv')
            }
        }

    })

}
function setPosts(posts){
    postsDiv = document.getElementById("posts")
    postsDiv.innerHTML = `
    <div class="optionPost">
        <!-- <h2>Scan</h2> -->
        <div class="categorieDiv">
            <a href="/files">
                <h3>Documents</h3>
                <p>Consulter les cours et documents</p>
            </a>
            <a href="/msg">
                <h3>Messagerie</h3>
                <p>Contacter vos professeurs du module</p>
            </a>
            <a href="/notes">
                <h3>Notes</h3>
                <p>Consulter vos notes d'évaluation</p>
            </a>
        </div>
        <div id="filtreDiv" class="filterDiv">
            <h3>Filtrer :</h3>
            <button class="filterDivB ${filtresVar[0] ? "filterSelected":""}">Cours</button>
            <button class="filterDivB ${filtresVar[1] ? "filterSelected":""}">TD</button>
            <button class="filterDivB ${filtresVar[2] ? "filterSelected":""}">TP</button>
        </div>
    </div>
    `
    np = 0
    for(var post of posts){
        np += 1
        nom = post.n + " " +post.pn
        writePoste(post["nom"], post["type"],  nom, post["contenu"], post["postID"], post["PJ_lens"], post["PJ_names"], post["date"], post["comm"], post["traveauRendre"], post["deadline"], post["role"], np)
    }
    updateTimes()
    setTravaux()
    
}
function getPosts(module){
    showLoadingAnimation()
    token = ""
    if(onMod==module){
        limit += 5
    }else{
        limit = 10
    }
    onMod = module

    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })
    
    socket.emit("getPosts", [module, token, limit])
    socket.on("getPosts", (data) => {
        postsVar = data
        setPosts(data)
        
        dataB = true
        checkLoad()
    })
    document.addEventListener('scroll', addAfterScroll);
    function addAfterScroll(){
        const scrollPosition = window.scrollY;
        // Calculate the total height of the page
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Check if the user has scrolled to the bottom of the page
        if (scrollPosition >= pageHeight-20 && ! isExtending) {
            isExtending = true
            getPosts(document.querySelectorAll('.selected_module')[0].children[0].innerHTML)
            setTimeout(() => {
                isExtending = false
            }, 1000*0.8);
        }
    }
}

function writePosteE(module, type, prof, content, postID, lens, names, date, comm, trav, deadline, role) {
    
    let [titre, contenu] = content.split("##").filter(Boolean)
    pjsHTML = ""
    extended = ""
    commSec = comm == 1 ? `<button onclick="showCommentSection(${postID}, '${titre}')" class='commentSectionBtn'>Commenter</button>` : ""
    travSec = trav == 1 ? `<button class='travSectionBtn ${deadline}'>Date limite:</button>` : ""
    
    if(lens.split("/").length > 0 && lens != ""){
        lens = lens.split("/")
        names = names.split("/")
        
        if(lens.length > 2){
           extended = " extendedPJ" 
        }
        pjsHTML = `<div class="postPieceJointe"><h4> piéce jointes :</h4>`
        curs = 0
        
        for(var i = 0; i < lens.length; i++) {
            curs += parseInt(lens[i])
            size = parseInt(lens[i]) <= 1024 ? parseInt(lens[i]) : (parseFloat(lens[i])/1024 <= 1024 ? (parseFloat(lens[i])/1024).toFixed(2) : (parseFloat(lens[i])/(1024*1024)).toFixed(2))
            size = `${size} ${parseInt(lens[i]) < 1024 ? "octets" : (parseInt(lens[i]) < 1024*1024 ? "Ko" : "Mo")}`
            link = names[i].endsWith(".pdf") ? "/icons/PDF.png" : (names[i].endsWith(".docx") ? "/icons/Word.png" : (names[i].endsWith(".png") || names[i].endsWith(".jpg")  ? "/icons/photo.png" :"/icons/File.png"))
            pjsHTML += `
                <a href="" class="pieceJointeElement" id="${postID}|${names[i]}">
                    <img class="PJimg icone" src="${link}">
                    <div class="PJtext">
                        <p>${names[i].length > 10 ? names[i].slice(0, 10) + "..." : names[i]}</p>
                        <p>${size}</p>
                    </div>
                </a>
            ` 
        }

        pjsHTML += `</div>`
    }
    for(mot of content.split("##")[2].split(" ")){
        if(mot.startsWith("https://") || mot.startsWith("http://") || mot.startsWith("www.")) {
            contenu = contenu.replace(mot, `<a href="${mot}" target="_blank">${mot}</a>`)
        }
    }

    postsDiv = document.getElementById("posts")
    dateA = date.split("T")
    dateA[1] = dateA[1].split(":")
    date = dateA[0] + " " + dateA[1][0] + ":" + dateA[1][1]
    postsDiv.innerHTML += `
    <div class="postElement">
    
        <div class="postTop">
            <div class="moduleTitleDiv">
                <h3>${module}</h3>
                <p ${role == "admin" ? "style='color:rgb(255, 102, 102);'" : ""}>${role == "admin" ? "Administrateur:" : ""} ${prof}</p>
            </div>
            <h3 class="postTitle">${titre}</h3>
            <p class="postDate">${date}</p>
            <div><button class="deleteModuleBtn" onclick="confirmDelete(${postID}, '${module}')">X</button></div>
        </div>
        <div class="postCore${extended}">
        <div class="postText">
        <p>${contenu.replaceAll("\n","<br>")}</p>
        </div>
        ${pjsHTML}
                    </div>
                    
                    <div class="postBottomDiv">
                    ${commSec}
                    ${travSec}
                    <!--<button class="commentSectionBtn">Commenter</button>
                    <button class="submitTravailBtn"> Remettre le travail demandé</button> -->
                    <!--<div class="postComment">
                    <div class="commentElement">
                    <div class="ProfileImg">
                        </div><div class="commentCore">
                        <p>{nom prénom}</p>
                        <input type="text">
                        <h3>></h3>
                    </div>
                </div>
            </div>
            <div class="SendBtn">
                <h3>Remettre le travail demandé</h3>
            </div> -->
        </div>
    </div>
    `
    
    // Mettez à jour le compte à rebours toutes les secondes
    pjB = document.querySelectorAll(".pieceJointeElement");
    pjB.forEach(pja => {
        pja.addEventListener('click', (e) => {
            e.preventDefault();
            download(pja.id.split("|")[0], pja.id.split("|")[1])
        })
    })
    comv = document.getElementById("comv")
    comv.addEventListener('click', (e) => {
        e.preventDefault();
        comv.innerHTML = comv.innerHTML == "Commentairer ❌" ? "Commentairer <b style='color:green;'>✔</b>" : "Commentairer ❌"
        comvB = comvB ? false : true
    })
    trav= document.getElementById("trav")
    trav.addEventListener('click', (e) => {
        e.preventDefault();
        trav.innerHTML = trav.innerHTML == "Travail a remettre ❌" ? "Travail a remettre <b style='color:green;'>✔</b>" : "Travail a remettre ❌"
        travB = travB ? false : true

        // popup pour mettre la date
        if (trav.innerHTML != "Travail a remettre ❌") {
            enterDatePopUp();
        }


    })
        // Drive, messagerie, Notes btns changing place when scroll
        optionPosts = document.querySelector('.categorieDiv');
        optionPostsHTML = optionPosts.innerHTML;
    
        function isVisible(element) {
            let bordures = element.getBoundingClientRect();
            return(bordures.bottom > 0)
        }
    
        var optionDivVisible = true;
        rightOptionPosts = document.querySelector('.rightPart .categorieDiv');
    
        document.addEventListener('scroll', () => {
            optionDivVisibleOLD = optionDivVisible
            optionDivVisible = isVisible(optionPosts)
    
            if (optionDivVisible != optionDivVisibleOLD) {
                if (optionDivVisible) {
                    rightOptionPosts.classList.remove('visibleCategorieDiv')
                } else {
                    rightOptionPosts.classList.add('visibleCategorieDiv')
                }
            }

        })

}

// entrer la date du rappel de post

async function enterDatePopUp() {
    toggleBackground(false);
    datePopUp = document.createElement('div');
    datePopUp.classList.add('popUp');
    datePopUp.classList.add('smallMsgPopUp');
    datePopUp.innerHTML = `
    <h3>Entrer la date du rappel</h3>
    <input id="inputDateRappel" type="datetime-local">
    <div class="confirmDialog">
    <button onclick="annulerDatePopUp()">Annuler</button>
    <button onclick="setDateRappel()">Definir</button>
    </div>`
    document.body.appendChild(datePopUp)

    await new Promise(resolve => {setTimeout(resolve, 20)});
    datePopUp.classList.add('popUpVisible')
}

function annulerDatePopUp() {
    toggleBackground(true);
    popUpToRemove = document.querySelector('.popUp')
    popUpToRemove.remove();
    trav= document.getElementById("trav")
    trav.innerHTML = trav.innerHTML == "Travail a remettre ❌" ? "Travail a remettre <b style='color:green;'>✔</b>" : "Travail a remettre ❌"
    travB = travB ? false : true
}

function setDateRappel() {
    dateTrav = document.getElementById('inputDateRappel').value;
    toggleBackground(true);
    popUpToRemove = document.querySelector('.popUp')
    popUpToRemove.remove();
    

}


// confirm delete des posts

async function confirmDelete(postID, moduleName) {
    toggleBackground(false);
    suprimerConfirmPopUp = document.createElement('div');
    suprimerConfirmPopUp.classList.add('popUp');
    suprimerConfirmPopUp.classList.add('smallMsgPopUp');
    suprimerConfirmPopUp.innerHTML = `
    <h3>Etes vous sur de vouloire suprmier ce post ?</h3>
    <div class="confirmDialog">
    <button onclick="cancelSupression()">Annuler</button>
    <button onclick="deletePostE(${postID},'${moduleName}')">Supprimer</button>
    </div>`
    document.body.appendChild(suprimerConfirmPopUp)

    await new Promise(resolve => {setTimeout(resolve, 20)});
    suprimerConfirmPopUp.classList.add('popUpVisible')
}

async function cancelSupression() {
    toggleBackground(true);
    popUpToRemove = document.querySelector('.popUp')
    popUpToRemove.classList.remove('popUpVisible')
    popUpToRemove.remove();
}

function deletePostE(postID, moduleName) {
    cancelSupression();
    socket.emit('deletePost', postID);
    socket.on("success", s => {
        if(s ==2 ){
            getPostsE(moduleName);

        }
    })
}

function setPostsE(posts){
    codeMod = document.querySelectorAll('.selected_module')[0].id.split(" ")[1]
    postsDiv = document.getElementById("posts")
    postsDiv.innerHTML = `
    
    <div id="profSide" class="postElement postElement_profSide">
        <input id="fileInput" type="file" style="display:none;" onchange="refrechFiles()" multiple/>
        <div class="postTop">
            <h3 class="postTitle">Titre : </h3>
            <input style="margin-left: 10px;" type="text" placeholder="Aa" id="postTitle">
        </div>
        <div class="postCore extendedPJ">
            <textarea id="postContent" rows="8" placeholder="Aa"></textarea>
            <div class="postPieceJointe" id="postPieceJointe">
                <h4>piéce jointes :</h4>
                <button onclick="document.getElementById('fileInput').click();">+</button>
                <!---<div class="pieceJointeElement">
                    <div class="PJimg"></div>
                    <div class="PJtext">
                        <p>Série TD1 RSF 2022</p>
                        <p>2.2Mb</p>
                    </div>
                </div> --->
            </div>
        </div>
        <div class="postBottomDiv">
            <button id="comv" class="profSideOption">Commentairer ❌</button>
            <button id="trav" class="profSideOption">Travail a remettre ❌</button>
            <button class="profSideOption" onclick="EnvoyerLePoste()">Envoyer</button>
        </div>
    </div>
    `
    comv = document.getElementById("comv")
    comv.addEventListener('click', (e) => {
        e.preventDefault();
        comv.innerHTML = comv.innerHTML == "Commentairer ❌" ? "Commentairer <b style='color:green;'>✔</b>" : "Commentairer ❌"
        comvB = comvB ? false : true
    })
    trav= document.getElementById("trav")
    trav.addEventListener('click', (e) => {
        e.preventDefault();
        trav.innerHTML = trav.innerHTML == "Travail a remettre ❌" ? "Travail a remettre <b style='color:green;'>✔</b>" : "Travail a remettre ❌"
        travB = travB ? false : true
        if (trav.innerHTML != "Travail a remettre ❌") {
            enterDatePopUp();
        }
    })
    
    for(var post of posts){
        nom = post.n + " " +post.pn
        writePosteE(post["nom"], post["type"], nom, post["contenu"], post["postID"], post["PJ_lens"], post["PJ_names"], post["date"], post["comm"], post["traveauRendre"], post["deadline"], post["role"])
    }
    updateTimes()
}
function getPostsE(filtre){
    showLoadingAnimation()
    secID = document.querySelectorAll('.selected_module')[0].id.split(" ")[0].replace("mod", "")
    token = ""
    if(onMod==filtre){
        limit += 5
    }else{
        limit = 10
    }
    onMod = filtre
    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })
    socket.emit("getPostsE", [token, filtre, secID, limit])
    socket.on("getPostsE", (data) => {
        setPostsE(data)
        dataB = true
        checkLoad()
    })
    document.addEventListener('scroll', addAfterScroll);
    function addAfterScroll(){
        const scrollPosition = window.scrollY;
        // Calculate the total height of the page
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Check if the user has scrolled to the bottom of the page
        if (scrollPosition >= pageHeight-20 && ! isExtending) {
            isExtending = true
            console.log(document.querySelectorAll('.selected_module')[0].children[0].innerHTML.split("| ")[1]);
            getPostsE(document.querySelectorAll('.selected_module')[0].children[0].innerHTML.split("| ")[1])
            setTimeout(() => {
                isExtending = false
            }, 1000*0.8);
        }
    }
}

function updateTimes(){
    document.querySelectorAll(".travSectionBtn").forEach((btn) => {
        const now = new Date().getTime(); // Obtenez le temps actuel en millisecondes
        const then = new Date(btn.classList[1]).getTime() ; // Obtenez le temps de fin en millisecondes
        const timeRemaining = then-now; // Calculer le temps restant en millisecondes
        if(timeRemaining > 0){
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            btn.innerHTML = `Date limite: ${days} jours, ${hours<10 ? "0" + hours : hours}:${minutes<10 ? "0" + minutes : minutes}:${seconds<10 ? "0" + seconds : seconds}  restantes`
        }else{
            const date = (new Date(then).getDay() < 10 ? "0" + new Date(then).getDay() : new Date(then).getDay()) + "/" + (new Date(then).getMonth() < 10 ? "0" + new Date(then).getMonth() : new Date(then).getMonth()) + "/" + new Date(then).getFullYear()
            const heure =  (new Date(then).getHours()<10? "0"+new Date(then).getHours() : new Date(then).getHours()) + ":" + (new Date(then).getMinutes()<10? "0"+new Date(then).getMinutes() : new Date(then).getMinutes())
            btn.innerHTML = `Date limite: expirée le ${date} a ${heure}`
        }
    })
    setTimeout(() => {
        updateTimes()
    }, 1000);
}
function setTravaux(){
    travaux = document.querySelectorAll(".travaux")[0]
    travaux.innerHTML = ""
    document.querySelectorAll(".travSectionBtn").forEach((btn) => {
        if(btn.innerHTML.split(" ")[2] == "expirée"){
            return
        }
        document.querySelectorAll(`.post${btn.classList[2]}`)[0]
        module = postsVar[btn.classList[2]-1].nom
        title = postsVar[btn.classList[2]-1].contenu.split("##")[1]
        
        travaux.innerHTML += `
        <div class="travauxElement" onclick="blink('post${btn.classList[2]}')">
            <a style="text-decoration:none;">
            <h3>${module}</h3>
            <p>${title}</p>
            </a>
        </div>
        `
        
    })
}

async function blink(id) {
    postToBlink = document.getElementById(id);

    elementRect = postToBlink.getBoundingClientRect();
    offset = window.pageYOffset || document.documentElement.scrollTop;
    elementPosition = elementRect.top + offset - 200;

    window.scrollTo({top: elementPosition, behavior: 'smooth'});

    postToBlink.style.animation = 'blink 0.5s linear';
    await new Promise(resolve => {setTimeout(resolve, 500)});
    postToBlink.style.animation = '';
    
}


