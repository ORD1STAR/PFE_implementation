
async function showMethode(module, modN, prof) {
    socket.emit("getMethode", module)
    socket.on("getMethode", (methode, nimp) => {
        
        let methodePopUp = document.createElement('div');
        methodePopUp.innerHTML = `
        <div class="popUpTop">
            <h3>Méthode de calcule</h3>
            <button onclick="hideMethode()">X</button>
        </div>
        <div class="parametresBody">
                <h3>Méthode de calcule module ${modN}</h3>
                <p>${methode}</p>
                <p>Contactez ${prof} pour plus de details</p>
        </div>`;
    
        document.body.appendChild(methodePopUp);
        methodePopUp.classList.add("popUp");
        methodePopUp.classList.add("parametresPopup");
        setTimeout(() => {
            methodePopUp.classList.add("popUpVisible");
            toggleBackground(false);
            socket.off("getMethode")
        }, 10);;
        
    })
}

async function hideMethode() {
    let parametresPopUp = document.querySelector('.popUpVisible');
    parametresPopUp.classList.remove("popUpVisible");
    await new Promise(r => setTimeout(r,100));
    parametresPopUp.remove();
    toggleBackground(true);
}