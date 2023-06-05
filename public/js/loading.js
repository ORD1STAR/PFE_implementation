var numberOfPopUps = 0;
var persoB = false, dataB = false;
function showLoadingAnimation() {
    toggleBackground(false)
    loadingPopup = document.createElement('div');
    // loadingPopup.classList.add('popUp');
    loadingPopup.classList.add('loadingPopup');
    loadingPopup.innerHTML = '<div class="lds-dual-ring"></div><p>Chargement</p>'
    document.body.appendChild(loadingPopup);
    loadingPopup.classList.add('popUpVisible');
}

function removeLoadingAnimation() {
    document.querySelector('.loadingPopup').remove()
    toggleBackground(true)
}

popUpBackground = document.getElementById("popUpBackground");
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


function checkLoad(){
    console.log(persoB, dataB);
    if(persoB && dataB && document.querySelector('.loadingPopup') != null ){
        console.log("-");
        removeLoadingAnimation()
    }
}



profileSubMenuBtn = document.querySelector(".profilePicDiv")

profileDiv = document.querySelector(".profileDiv")
profileDiv.addEventListener("click", showProfileSubMenu)

async function showProfileSubMenu() {
    profileSubMenuDiv = document.createElement('div');
    profileSubMenuDiv.innerHTML = `
                <a href="/pagePersonelle"><p>Espace Personnel</p></a>
                ${role == "admin" ? `<a href="/listeEtudiants"><p>Liste des étudiants</p></a>` : ""}
                ${role == "admin" ? `<a href="/Creation_enseignant"><p>Liste des enseignants</p></a>` : ""}
                ${role == "admin" ? `<a href="/Admin_Doleances"><p>Doleances</p></a>` : ""}
                ${role != "admin" ? `<a href="/msg"><p>Messagerie</p></a>` : ""}
                ${role != "admin" ? (role != "ens" ? `<a href="/edt"><p>Emploie du temps</p></a>` : "") : ""}
                ${role != "admin" ? (role != "ens" ? `<a href="/notes"><p>Délibération</p></a>` : "") : ""}
                <div class="delimiteur"></div>
                <a href="#" onclick="showParametres()"><p>Parametres</p></a>
                <a href="/disconnect"><p>se déconnecter</p></a>`;
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