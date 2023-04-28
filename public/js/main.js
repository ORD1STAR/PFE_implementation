
// Profile SubMenu Handler

const profileSubMenu = document.querySelector(".profileSubMenu")
const profileSubMenuBtn = document.getElementById("profileSubMenuBtn")

profileSubMenuBtn.addEventListener("click", () => {
    profileSubMenu.classList.toggle("profileSubMenuSHOWN")
})


function writePoste(module, prof, content, pj, lens, names, date) {
    pjsHTML = ""
    if(pj.byteLength > 0){
        lens = lens.split("/")
        console.log(lens);
        names = names.split("/")
        pjs = []
        curs = 0
        pjsHTML = `<div class="postPieceJointe"><h4> piéce jointes :</h4>`
    
        for(var i = 0; i < lens.length; i++) {
            curs += parseInt(lens[i])
            pjs.push(pj.slice(i==0 ? 0 : parseInt(lens[i-1]), curs))
            size = `${pjs[i].byteLength} ${pjs[i].byteLength < 1024 ? "octets" : "Mo"}`

            fileb = new Blob([pjs[i]], {type: "application/txt"})
            const fileUrl = URL.createObjectURL(fileb);

            pjsHTML += `
                <a href="${fileUrl}" download="${names[i]}" class="pieceJointeElement" id="pj${i}">
                    <div class="PJimg"> </div>
                    <div class="PJtext">
                        <p>${names[i]}</p>
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
                <h3>${module}</h3>
                <p>${prof}</p>
            </div>
            <h3 class="postTitle">${titre}</h3>
        </div>
        <div class="postCore">
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
}
function setPosts(posts){
    postsDiv = document.getElementById("posts")
    postsDiv.innerHTML = `
    <div class="optionPost">
        <!-- <h2>Scan</h2> -->
        <div class="categorieDiv">
            <a href="">
                <h3>Drive</h3>
                <p>Consulter les cours et documents</p>
            </a>
            <a href="">
                <h3>Messagerie</h3>
                <p>Contacter vos professeurs du module</p>
            </a>
            <a href="">
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
    `
    for(var post of posts){
        writePoste(post["nom"], post["login"], post["contenu"], post["PJ"], post["PJ_lens"], post["PJ_names"], post["date"])
    }
}
function getPosts(sectionID, filtre){
    socket.emit("getPosts", [sectionID, filtre])
    socket.on("getPosts", (data) => {
        setPosts(data)
    })
}

function writePosteE(module, prof, content, pj, lens, names, date) {
    //pj is a blob element and i want the user to download it from the database
    
    fileb = new Blob([pj], {type: "application/sql"})
    const fileUrl = URL.createObjectURL(fileb);
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.download = 'test.sql';
    //downloadLink.click();



    postsDiv = document.getElementById("posts")
    dateA = date.split("T")
    dateA[1] = dateA[1].split(":")
    date = dateA[0] + " " + dateA[1][0] + ":" + dateA[1][1]
    let [titre, contenu] = content.split("##").filter(Boolean)
    postsDiv.innerHTML += `
    <div class="postElement">
    
        <div class="postTop">
            <div class="moduleTitleDiv">
                <h3>${module}</h3>
                <p>${prof}</p>
            </div>
            <h3 class="postTitle">${titre}</h3>
        </div>
        <div class="postCore">
        <div class="postText">
        <p>${contenu}</p>
        </div>
        <!--<div class="postPieceJointe">
        <h4>piéce jointes :</h4>
        <div class="pieceJointeElement">
        <div class="PJimg">
        </div>
        <div class="PJtext">
        <p>Série TD1 RSF 2022</p>
        <p>2.2Mb</p>
        </div>
        </div>
                    <div class="pieceJointeElement">
                    <div class="PJimg">
                    </div>
                    <div class="PJtext">
                    <p>Série TD1 RSF 2022</p>
                    <p>2.2Mb</p>
                    </div>
                    </div>
                    </div> -->  
                    </div>
                    <p style='padding:0;margin:0;margin-left:80%;color:grey;'> ${date}</p>
                    <div class="postBottomDiv">
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
}
function setPostsE(posts){
    postsDiv = document.getElementById("posts")
    postsDiv.innerHTML = `
    <div class="optionPost">
        <!-- <h2>Scan</h2> -->
        <div class="categorieDiv">
            <a href="">
                <h3>Drive</h3>
                <p>Consulter les cours et documents</p>
            </a>
            <a href="">
                <h3>Messagerie</h3>
                <p>Contacter vos professeurs du module</p>
            </a>
            <a href="">
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
    `
    for(var post of posts){
        writePosteE(post["nom"], post["login"], post["contenu"], post["PJ"], post["PJ_lens"], post["PJ_names"], post["date"])
    }
}
function getPostsE(token, filtre){
    socket.emit("getPostsE", [token, filtre])
    socket.on("getPostsE", (data) => {
        setPostsE(data)
    })
}

// Module Select (in menu)
//const modulesBtns = document.querySelectorAll('.moduleElement');
//modulesBtns.forEach(moduleBtn => {
//    moduleBtn.addEventListener('click', () => {
//        modulesBtns.forEach(moduleBtn => {moduleBtn.classList.remove("selected_module")})
//        moduleBtn.classList.add("selected_module")
//    })
//})




// Toggle Background

const leftMenu = document.getElementById('leftMenu');
const imgBtnToogleMenu = document.getElementById('imgBtnToogleMenu');
// const popUpBackground = document.getElementById("popUpBackground");

function toggleBackground(isBackgroundShown) {
    // isShown = true => remove background
    // isShown = false => show background
    if (isBackgroundShown) {
        popUpBackground.style.display = "none";
        popUpBackground.style.pointerEvents = "none";
    } else {
        popUpBackground.style.display = "block";
        popUpBackground.style.pointerEvents = "all";
    }
};

// export { toggleBackground }



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