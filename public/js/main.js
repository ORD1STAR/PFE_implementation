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
filtresVar = [true, true, true]

// Profile SubMenu Handler

profileDiv = document.querySelector(".profileDiv")
profileSubMenuBtn = document.querySelector(".profilePicDiv")

profileSubMenuBtn.addEventListener("click", showProfileSubMenu)

async function showProfileSubMenu() {
    profileSubMenuDiv = document.createElement('div');
    profileSubMenuDiv.innerHTML = `
                <a href="#"><p>Espace Personnel</p></a>
                <a href="/msg"><p>Messagerie</p></a>
                <a href="/edt"><p>Emploie du temps</p></a>
                <a href="/notes"><p>Délibération</p></a>
                <div class="delimiteur"></div>
                <a href="#" onclick="showParametres()"><p>Parametres</p></a>
                <a href="/disconnect"><p>se déconecter</p></a>`;
    document.body.appendChild(profileSubMenuDiv)
    profileSubMenuDiv.classList.add('profileSubMenu');
    
    toggleBackground(false)
    await new Promise(r => setTimeout(r,10));
    profileSubMenuDiv.classList.add('profileSubMenuSHOWN');

    document.addEventListener('click', hideProfileSubMenu);

}

async function hideProfileSubMenu(e) {
    if (!profileSubMenuDiv.contains(e.target) && e.target != profileSubMenuBtn) {
        profileSubMenuDiv.classList.remove('profileSubMenuSHOWN');
        document.removeEventListener('click', hideProfileSubMenu)
        await new Promise(r => setTimeout(r, 300))
        profileSubMenuDiv.remove();
        toggleBackground(true);
    }
}





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
var numberOfPopUps = 0;

function toggleBackground(isBackgroundShown) {
    // isShown = true => remove background
    // isShown = false => show background
    if (isBackgroundShown) {
        numberOfPopUps -= 1;
        if (numberOfPopUps == 0) {
            popUpBackground.style.display = "none";
            popUpBackground.style.pointerEvents = "none";
        }
    } else {
        numberOfPopUps += 1;
        popUpBackground.style.display = "block";
        popUpBackground.style.pointerEvents = "all";
    }
};



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
            <h3>Parametres généraux</h3>
            <div class="paramElement">
                <p>- Rester connecter</p>
                <input type="checkbox" id="resterConnecterCheckBox">
            </div>
            <div class="ParamSeparateur"></div>
            <h3>Affichage</h3>
            <div class="paramElement">
                <p>- Theme</p>
                <div class="themeSelect">
                    <button class="themeBtn${selected==0? " selectedTheme": ""}" onclick="selectTheme('0')">Foncé</button>
                    <button class="themeBtn${selected==1? " selectedTheme": ""}" onclick="selectTheme('1')">Mixte</button>
                    <button class="themeBtn${selected==2? " selectedTheme": ""}" onclick="selectTheme('2')">Claire</button>
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
    contenu = "##" + titre + "##" + contenu
    files = document.getElementById("fileInput").files
    type = document.getElementsByClassName("selected_module")[0].id.split(" ")[2]
    section = document.querySelectorAll('.selected_module')[0].innerHTML.split("| ")[0].replace("<p>", "");
    secID = document.querySelectorAll('.selected_module')[0].id.split(" ")[0].replace("mod", "")
    codeMod = document.querySelectorAll('.selected_module')[0].id.split(" ")[1]
    module = document.querySelectorAll('.selected_module')[0].innerHTML.split("| ")[1].replace('</p><div class="notifDiv"></div>', "");
    filesNames = [];
    filesLens = [];
    for(file of files){
        filesNames.push(file.name)
        filesLens.push(file.size)
    }
    socket.emit("setPost", [document.cookie.split('; ')[1].split('=')[1], window.ensID, contenu, codeMod, files, filesLens, filesNames, comvB, travB, type])
    document.getElementById("postTitle").value = ""
    document.getElementById("postContent").value = ""
    document.getElementById("fileInput").value = ""
    getPostsE(module)
}

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
function writePoste(module, type, prof, content, postID, lens, names, date, comm, trav) {
    filtres = Array.from(document.querySelectorAll(".filterSelected"));
    for(var i = 0; i < filtres.length; i++) {
        filtres[i] = filtres[i].innerHTML.toLowerCase()
    }
    
    if(filtres.includes(type)){
        pjsHTML = ""
        extended = ""
        commSec = comm == 1 ? `<button onclick="showCommentSection(${postID})" class='commentSectionBtn'>Commenter</button>` : ""
        travSec = trav == 1 ? "<button class='submitTravailBtn'>Remettre le travail demandé</button>" : ""
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
                pjsHTML += `
                    <a href="" class="pieceJointeElement" id="${postID}|${names[i]}">
                        <div class="PJimg"> </div>
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
        let [titre, contenu] = content.split("##").filter(Boolean)
        postsDiv.innerHTML += `
        <div class="postElement">
        
            <div class="postTop">
                <div class="moduleTitleDiv">
                    <h3>${module}| ${type}</h3>
                    <p>${prof}</p>
                </div>
                <h3 class="postTitle">${titre}</h3>
            </div>
            <div class="postCore${extended}">
            <div class="postText">
            <p>${contenu}</p>
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
                        <p style='padding:0;margin:0;margin-left:80%;color:grey;'> ${date}</p>
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
                <h3>Drive</h3>
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
    for(var post of posts){
        writePoste(post["nom"], post["type"],  post["login"], post["contenu"], post["postID"], post["PJ_lens"], post["PJ_names"], post["date"], post["comm"], post["traveauRendre"])
    }
}
function getPosts(module){
    socket.emit("getPosts", [module, document.cookie.split('; ')[1].split('=')[1]])
    socket.on("getPosts", (data) => {
        postsVar = data
        setPosts(data)
    })
}

function writePosteE(module, type, prof, content, postID, lens, names, date, comm, trav) {
    pjsHTML = ""
    extended = ""
    commSec = comm == 1 ? `<button onclick="showCommentSection(${postID})" class='commentSectionBtn'>Commenter</button>"` : ""
    travSec = trav == 1 ? "<button class='travSectionBtn'>Remettre le travail demandé</button>" : ""
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
            pjsHTML += `
                <a href="" class="pieceJointeElement" id="${postID}|${names[i]}">
                    <div class="PJimg"> </div>
                    <div class="PJtext">
                        <p>${names[i].length > 10 ? names[i].slice(0, 10) + "..." : names[i]}</p>
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
    let [titre, contenu] = content.split("##").filter(Boolean)
    postsDiv.innerHTML += `
    <div class="postElement">
    
        <div class="postTop">
            <div class="moduleTitleDiv">
                <h3>${module}| ${type}</h3>
                <p>${prof}</p>
            </div>
            <h3 class="postTitle">${titre}</h3>
        </div>
        <div class="postCore${extended}">
        <div class="postText">
        <p>${contenu}</p>
        </div>
        ${pjsHTML}
                    </div>
                    <p style='padding:0;margin:0;margin-left:80%;color:grey;'> ${date}</p>
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
        comv.innerHTML = comv.innerHTML == "Commentairer (X)" ? "Commentairer (V)" : "Commentairer (X)"
        comvB = comvB ? false : true
    })
    pjv= document.getElementById("pjv")
    pjv.addEventListener('click', (e) => {
        e.preventDefault();
        pjv.innerHTML = pjv.innerHTML == "Piéces jointes (X)" ? "Piéces jointes (V)" : "Piéces jointes (X)"
        pjvB = pjvB ? false : true
    })
    trav= document.getElementById("trav")
    trav.addEventListener('click', (e) => {
        e.preventDefault();
        trav.innerHTML = trav.innerHTML == "Travail a remettre (X)" ? "Travail a remettre (V)" : "Travail a remettre (X)"
        travB = travB ? false : true
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
function setPostsE(posts){
    postsDiv = document.getElementById("posts")
    postsDiv.innerHTML = `
    <div class="optionPost">
        <!-- <h2>Scan</h2> -->
        <div class="categorieDiv">
            <a href="/files">
                <h3>Drive</h3>
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
            <button>Cours</button>
            <button class="filterSelected">TD</button>
            <button class="filterSelected">TP</button>
        </div>
    </div>




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
            <button id="comv" class="profSideOption">Commentairer (X)</button>
            <button id="pjv" class="profSideOption">Piéces jointes (X)</button>
            <button id="trav" class="profSideOption">Travail a remettre (X)</button>
            <button class="profSideOption" onclick="EnvoyerLePoste()">Envoyer</button>
        </div>
    </div>
    `

    
    for(var post of posts){
        writePosteE(post["nom"], post["type"], post["login"], post["contenu"], post["postID"], post["PJ_lens"], post["PJ_names"], post["date"], post["comm"], post["traveauRendre"])
    }
}
function getPostsE(filtre){
    secID = document.querySelectorAll('.selected_module')[0].id.split(" ")[0].replace("mod", "")
    socket.emit("getPostsE", [document.cookie.split('; ')[1].split('=')[1], filtre, secID])
    socket.on("getPostsE", (data) => {
        setPostsE(data)
    })
}
