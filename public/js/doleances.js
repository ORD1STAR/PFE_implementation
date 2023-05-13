
const deleteDoleanceBtns = document.querySelectorAll('.deleteDoleanceBtn');

function deleteDoleance(e, id) {
    e.target.parentElement.remove();
    socket.emit("deleteDoleance", id);
}


//BACK

socket.emit("getDoleances", "dol")

socket.on("getDoleances", (doleances) => {

    doleances.forEach(doleance => {
        date = new Date(doleance.date)
        document.getElementById("mainWrapper").innerHTML += `

        <div class="doleance">
                <div class="doleanceTop">
                    <h3>Titre</h3>
                    <p>${doleance.titre}</p>
                </div>
                <div class="doleanceCore">
                    <p>${doleance.content} </p>
                    
                </div>
                <div class="doleanceInformations">
                    <div class="doleanceInformationElement">
                        <p>Etudiant(e) : </p>
                        <p>${doleance.nom}</p>
                        <p>${doleance.prenom}</p>
                    </div>
                    <div class="doleanceInformationElement">
                        <p>Matricule : </p>
                        <p>${doleance.matricule}</p>
                    </div>
                    <div class="doleanceInformationElement">
                        <p>Section : </p>
                        <p>L${doleance.niveau} ${doleance.specialite}</p>
                    </div>
                    <div class="doleanceInformationElement">
                        <p>date : </p>
                        <p>${date.toLocaleDateString("en-US")}</p>
                        <p>${date.toLocaleDateString("en-US", {hour: "2-digit", hour12:false, minute: "numeric"})}</p>
                    </div>
                </div>
                <button onclick="deleteDoleance(event, ${doleance.dol_id})">Suprimer</button>
            </div>

        `
    })
    
})