
async function showMethode(module) {
    let methodePopUp = document.createElement('div');
    methodePopUp.innerHTML = `
    <div class="popUpTop">
        <h3>Méthode de calcule</h3>
        <button onclick="hideMethode()">X</button>
    </div>
    <div class="parametresBody">
            <h3>Méthode de calcule module ${module}</h3>
            <p>la méthode de calcule de ce module n'est pas disponible</p>
            <p>Contactez mr xxxxxx pour plus de details</p>
    </div>`;

    document.body.appendChild(methodePopUp);
    methodePopUp.classList.add("popUp");
    methodePopUp.classList.add("parametresPopup");
    await new Promise(r => setTimeout(r, 10));
    methodePopUp.classList.add("popUpVisible");
    toggleBackground(false);
}

async function hideMethode() {
    let parametresPopUp = document.querySelector('.popUpVisible');
    parametresPopUp.classList.remove("popUpVisible");
    await new Promise(r => setTimeout(r,100));
    parametresPopUp.remove();
    toggleBackground(true);
}