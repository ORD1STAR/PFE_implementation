
function setStudents(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('section');
    if(id == null){
        secID = document.getElementById("secSelect").value;
    }else{
        secID = id
        urlParams.delete('section');
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    html = ""
    etudiants.forEach(etd => {
        if(etd.section == secID){
            link = ""
            pdp = etd["photo"]
            if(pdp.byteLength != 0){                   
                pdpB = new Blob([pdp])
                myURL = URL.createObjectURL(pdpB)
                link = myURL
            }
            html += `<div class="etudiantElement AdminView">
            <img class="profilePicDiv" src=${link} style="width:50px;height:50px;">
            <div class="etudiantInformations">
                <div class="etudiantInformaionElement">
                    <p>${etd.nom}</p>
                    <p>${etd.prenom}</p>
                </div>
                <div class="etudiantInformaionElement">
                    <h4>Matricule : </h4>
                    <p>${etd.matricule}</p>
                </div>
                <div class="etudiantInformaionElement">
                    <h4>Email : </h4>
                    <p>${etd.email.length > 20 ? etd.email.slice(0,20) + "..." : etd.email}</p>
                </div>
            </div>

            <div class="EtudiantOption">
                ${etd.section == 0 ? "" : `<button onclick="rem('${etd.matricule}', '${secID}')">Retirer</button>`}
                <button onclick="cp('${etd.email}')">email</button>
            </div>
        </div>`
        }
    })
    listCont.innerHTML = html
}

function rem(matricule, section){
    socket.emit("removeStudent", matricule)
    socket.emit("getListeEtudiants")
    socket.on("getListeEtudiants", (etd) => {etudiants = etd})
    setTimeout(() => {
        setStudents(section)
    }, 2000);
}
function cp(mail) {
    navigator.clipboard.writeText(mail)
}
