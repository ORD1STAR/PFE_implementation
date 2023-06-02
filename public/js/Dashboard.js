
var oldData = []
var toDelete = []
var toAdd = []

canAdd = true
const modulesDiv = document.getElementById('DashboardModuleDiv');

const ajouterModuleBtn = document.getElementById('ajouterModuleBtn');
ajouterModuleBtn.addEventListener('click', showAjoutSection);
var moduleCreationHTML = `
<input type='text' placeholder='nom module'>`
socket.emit("getLsEnseignants")
socket.on("getLsEnseignants", (data) => {
    moduleCreationHTML += `
        <div class="normalSection moduleSubElement">
            <p class="libelle">Cours</p>
            <select>
            <option value="#">pas d'enseignant</option>`
                
    data.forEach(prof => {
        moduleCreationHTML += `
                    <option value="${prof.idUser}">${prof.nom} ${prof.prenom}</option>
                    `
    })
    moduleCreationHTML += `
    </select>
    </div>
    <div class="normalSection moduleSubElement">
        <p class="libelle">TD</p>
        <select>
        <option value="#">pas d'enseignant</option>`
            
data.forEach(prof => {
    moduleCreationHTML += `
                <option value="${prof.idUser}">${prof.nom} ${prof.prenom}</option>
                `
})
moduleCreationHTML += `
</select>
</div>
<div class="normalSection moduleSubElement">
    <p class="libelle">TP</p>
    <select>
        <option value="#">pas d'enseignant</option>`
                
    data.forEach(prof => {
        moduleCreationHTML += `
                    <option value="${prof.idUser}">${prof.nom} ${prof.prenom}</option>
                    `
    })
    moduleCreationHTML += `
    </select>
    </div>
    <div class="moduleSubElement ajoutElement">
        <button onclick='cancelAjoutModule()'>Annuler</button>
        <button onclick='confirmerAjout()'>Ajouter</button>
    </div>
    `
})



function dlEtudiants(){
    sec = document.querySelectorAll('.selected_module')[0].id
    socket.emit("dlEtudiants", sec)
    socket.on("dlEtudiants", (data) => {
        fileb = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
        const fileUrl = URL.createObjectURL(fileb);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', `etudiantsSection${sec}.xlsx`);
        link.click()
    })
    
}

function dlEDT() {
    sec = document.querySelectorAll('.selected_module')[0].id;
    socket.emit("dlEDT", sec);
    socket.on("dlEDT", (data) => {
        if (data != undefined) {
            fileb = new Blob([data.edtFile], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const fileUrl = URL.createObjectURL(fileb);
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', `emploiDuTempsSection${sec}.xlsx`);
            link.click();
        } else {
            alert("Pas d'emploi du temps pour cette section");
        }
    });
}

function addSection(){
    secName = document.getElementById('secName').value
    secInd = document.getElementById('secInd').value
    secSpe = document.getElementById('secSpe').value
    secFil = document.getElementById('secFil').value
    secAnn = document.getElementById('secAnn').value
    etudiants = document.getElementById('LSetudiants').files[0]
    edt = document.getElementById('EDT').files[0]
    modules = toAdd
    toAdd = []
    socket.emit("addSection", [secName, secInd, secSpe, secFil, secAnn, etudiants, edt, modules])
    socket.on("success", (s, sec)=> {
        if(s==1){
            alert("Section ajoutée avec succès")
            location.reload()
        }
    })
}

async function showAjoutSection() {
    if(canAdd){
        ajouterModuleBtn.style.display = 'none !important'; // marche pas
        ajoutModuleElement = document.createElement('div');
        ajoutModuleElement.classList.add('normalSection');
        ajoutModuleElement.classList.add('DashboardModuleElement');
        ajoutModuleElement.classList.add('ElementToAdd');
        ajoutModuleElement.innerHTML = moduleCreationHTML;
        modulesDiv.insertBefore(ajoutModuleElement, document.getElementById('ajouterModuleBtn'));
        ajoutModuleElement.classList.add('zeroHeight');
        
        await new Promise(r => setTimeout(r, 20));
        ajoutModuleElement.classList.remove('zeroHeight');
        canAdd = false
    }
}



async function cancelAjoutModule() {
    try {
        canAdd = true
        ajouterModuleBtn.style.display = 'block'
        elementToAdd = document.querySelector('.ElementToAdd');
        elementToAdd.classList.add('zeroHeight');
        await new Promise(r => setTimeout(r, 250));
        elementToAdd.remove();
    } catch {}
}


var tempModules = [];
var newModule = []

async function confirmerAjout() {
    elementToAdd = document.querySelector('.ElementToAdd');
    newModuleTitle = elementToAdd.querySelector('input');


    if (newModuleTitle.value == "") {
        newModuleTitle.style.animation = '';
        newModuleTitle.style.animation = 'flashingError 0.5s linear';
        await new Promise(r => setTimeout(r, 550));
        newModuleTitle.style.animation = '';
        return
    }
    enss = document.querySelector('.ElementToAdd').querySelectorAll("select")
    toAdd.push([newModuleTitle.value,document.querySelectorAll('.selected_module')[0].id, enss[0].value, enss[1].value, enss[2].value])
    canAdd = true
    // enlever la class .ElementToAdd de l'élement ajouté
    elementToAdd.classList.remove('ElementToAdd');
    
    // supprimer les boutons "annuler" et "ajouter"
    confirmBtnDiv = document.querySelector('.ajoutElement');
    confirmBtnDiv.remove();
    
    // afficher le bouton d'ajout
    ajouterModuleBtn.style.display = 'block';
    
    // transformation des selects en text
    elementToAdd.querySelectorAll('select').forEach(element => {
        P_element = document.createElement('p');
        P_element.classList.add('notInEditMode');
        P_element.innerHTML = element.options[element.selectedIndex].text;
        element.parentElement.appendChild(P_element);
        element.classList.add('editModeOnly');
    });
    
    // transformation de l'input titre en text
    H3_element = document.createElement('h3');
    H3_element.innerHTML = newModuleTitle.value;
    elementToAdd.insertBefore(H3_element,newModuleTitle)
    newModuleTitle.remove();

    // adding the delete button on edit mode
    deleteModuleBtn = document.createElement('div');
    deleteModuleBtn.innerHTML = `<button class="deleteModuleBtn editModeOnly" onclick="deleteModule(event)">X</button>`;
    elementToAdd.appendChild(deleteModuleBtn);
    
    // add the element in temp array waiting to be confirmed
    tempModules.push(elementToAdd);

}






// delete module

var moduleToDeleteArr = [];

async function deleteModule(event, codeMod) {
    moduleToDelete = event.target.parentElement.parentElement;
    moduleToDeleteArr.push(moduleToDelete);
    moduleToDelete.classList.add('zeroHeight');
    
    toDelete.push(codeMod);

    await new Promise(r => setTimeout(r, 550));
    moduleToDelete.style.display = 'none';
    
    
}








//      Edit Mode

const mainWrapper = document.getElementById('mainWrapper');

function DashboardSwitchToEdit() {
    mainWrapper.classList.add('DashboardEditMode');
    if(oldData.length > 0 && document.querySelectorAll(".ensSelect").length > 0) {
        oldData.forEach((data, i) => {
            document.querySelectorAll(".ensSelect")[0+3*i].value = data[1]
            document.querySelectorAll(".ensSelect")[1+3*i].value = data[2]
            document.querySelectorAll(".ensSelect")[2+3*i].value = data[3]
        })
    }

    ajouterModuleBtn.style.display = 'block';

}

function DashboardSwitchToNormal() {
    toAdd = [];
    toDelete = [];
    
    mainWrapper.classList.remove('DashboardEditMode');
    cancelAjoutModule();
    
    // supprimer les modules ajoutés mais pas confirmés
    tempModules.forEach(element => {
        element.remove();
    })

    moduleToDeleteArr.forEach(element => {
        element.style.display = 'block';
        setTimeout(() => {
            element.classList.remove('zeroHeight');
            
        }, 20);
        //document.getElementById('DashboardModuleDiv').insertBefore(element, document.getElementById("ajouterModuleBtn"));
    })

    ajouterModuleBtn.style.display = 'none';
    
}


// edit mode confirm

function confirmEdit() {
    tempModule = [];        // ajouter tt dans la bdd

    if(oldData.length > 0 && document.querySelectorAll(".ensSelect").length > 0){
        
        oldData.forEach((data, i) => {
            cours = document.querySelectorAll(".ensSelect")[0+3*i].value
            td = document.querySelectorAll(".ensSelect")[1+3*i].value
            tp = document.querySelectorAll(".ensSelect")[2+3*i].value
            
            if(data[1] != cours){
                tempModule.push([data[0], "cours", cours])
            }
            if(data[2] != td){
                tempModule.push([data[0], "td", td])
            }
            if(data[3] != tp){
                tempModule.push([data[0], "tp", tp])
            }
        })
    }
    
    etudiants = document.getElementById('LSetudiants').files[0]
    edt = document.getElementById('EDT').files[0]
    if(etudiants != undefined){
        socket.emit("adminEditStudents", etudiants, document.querySelectorAll('.selected_module')[0].id)
    }
    if(edt != undefined){
        socket.emit("adminEditEDT", edt, document.querySelectorAll('.selected_module')[0].id)
    }
    socket.emit("adminEditModules", [tempModule, toDelete, toAdd])
    socket.on("success", s => {
        if(s == 1){
            moduleToDeleteArr.forEach(element => {
                element.remove();
            });
            DashboardSwitchToNormal();
            printData(document.querySelectorAll('.selected_module')[0].id)
        }
    })
}













// notInCreation
// inCreationModeOnly



//      Switch to creation

function switchToCreation() {
    // annuler tout les edits en cours
    DashboardSwitchToNormal();
    DashboardSwitchToEdit();

    oldData = []


    // suprimer les modules qui existent
    document.querySelectorAll('.DashboardModuleElement').forEach(element => {
        element.remove();    
    });

    // cacher tous les bouton d'ajout / confirm / annuler
    mainWrapper.classList.add('CreationMode')
}



function switchToDashboard() {
    // annuler tout les edits en cours
    DashboardSwitchToNormal();
    // suprimer les modules qui existent
    document.querySelectorAll('.DashboardModuleElement').forEach(element => {
        element.remove();    
    });
    toDelete = []
    toAdd = []


    mainWrapper.classList.remove('CreationMode')
}



function printData(secID){
    socket.emit("getSectionData", secID);
    socket.on("getSectionData", setData)
    function setData(data) {
        sectionData = data[0]
        modules = data[1]
        lvl = sectionData.niveau == 0 ? "" : ((sectionData.niveau <= 3 ? "L" : "M") + (sectionData.niveau <= 3 ? sectionData.niveau : sectionData.niveau-3))
        document.getElementById("name").innerHTML = `${lvl} ${sectionData.specialite}${sectionData.indice != "" ? ", " + sectionData.indice : ""}`;
        document.getElementById("specialite").innerHTML = sectionData.specialite;
        document.getElementById("filliere").innerHTML = sectionData.filliere;
        document.getElementById("niveau").innerHTML = sectionData.niveau <= 3 ? sectionData.niveau : sectionData.niveau-3;
        document.getElementById("palier").innerHTML = sectionData.niveau <= 3 ? "Licence" : "Master";
        document.getElementById("nbEtudiants").innerHTML = data[3] == null ? 0 : data[3].nbEtudiants;
        document.getElementById("nbProfs").innerHTML = data[4] == null ? 0 : data[4].nbProf;
        if(modules.length > 0){
            htmlToAdd = `<h3>Modules</h3>`
            oldData = []
            modules.forEach(mod => {
                htmlToAdd += `
                <div class="normalSection DashboardModuleElement">
                    <h3>${mod.nom}</h3>`
                foundC = false
                foundD = false
                foundP = false
                newData = [mod.codeMod]
                data[2].forEach(modData => {
                    if(modData.codeMod == mod.codeMod) {
                        if(modData.type == "cours"){
                            foundC = true
                            htmlToAdd += `
                            <div class="normalSection moduleSubElement">
                                <p class="libelle">Cours</p>
                                <select class="editModeOnly ensSelect">
                                    <option value="#">pas d'enseignant</option>
                            `
                            np = ""
                            data[5].forEach(ens => {
                                htmlToAdd += `<option value="${ens.idUser}">${ens.nom} ${ens.prenom}</option>`
                                if(ens.idUser == modData.enseignantID){
                                    np = `${ens.nom} ${ens.prenom}`
                                    newData.push(ens.idUser)
                                }
                            })
                            htmlToAdd +=`    </select>
                                <p class="notInEditMode">${np}</p>
                            </div>
                            `
                        }
                    }
                })
                if(!foundC){
                    htmlToAdd += `
                    <div class="normalSection moduleSubElement">
                        <p class="libelle" style="background-color:grey !important;">Cours</p>
                        <select class="editModeOnly ensSelect">
                            <option value="#">pas d'enseignant</option>
                    `
                    data[5].forEach(ens => {
                        htmlToAdd += `<option value="${ens.idUser}">${ens.nom} ${ens.prenom}</option>`
                    })
                    newData.push("#")
                    htmlToAdd +=`    </select>
                        <p class="notInEditMode">pas d'enseignant</p>
                    </div>
                    `
                }
                data[2].forEach(modData => {
                    if(modData.codeMod == mod.codeMod) {
                        if(modData.type == "td"){
                            foundD = true
                            htmlToAdd += `
                            <div class="normalSection moduleSubElement">
                                <p class="libelle">TD</p>
                                <select class="editModeOnly ensSelect">
                                    <option value="#">pas d'enseignant</option>
                            `
                            np = ""
                            data[5].forEach(ens => {
                                htmlToAdd += `<option value="${ens.idUser}">${ens.nom} ${ens.prenom}</option>`
                                if(ens.idUser == modData.enseignantID){
                                    np = `${ens.nom} ${ens.prenom}`
                                    newData.push(ens.idUser)
                                }
                            })
                            htmlToAdd +=`    </select>
                                <p class="notInEditMode">${np}</p>
                            </div>
                            `
                        }
                    }
                })
                if(!foundD){
                    htmlToAdd += `
                    <div class="normalSection moduleSubElement">
                        <p class="libelle" style="background-color:grey !important;">TD</p>
                        <select class="editModeOnly ensSelect">
                            <option value="#">pas d'enseignant</option>
                    `
                    data[5].forEach(ens => {
                        htmlToAdd += `<option value="${ens.idUser}">${ens.nom} ${ens.prenom}</option>`
                    })
                    newData.push("#")
                    htmlToAdd +=`    </select>
                        <p class="notInEditMode">pas d'enseignant</p>
                    </div>
                    `
                }
                data[2].forEach(modData => {
                    if(modData.codeMod == mod.codeMod) {
                        if(modData.type == "tp"){
                            foundP = true
                            htmlToAdd += `
                            <div class="normalSection moduleSubElement">
                                <p class="libelle">TP</p>
                                <select class="editModeOnly ensSelect">
                                    <option value="#">pas d'enseignant</option>
                            `
                            np = ""
                            data[5].forEach(ens => {
                                htmlToAdd += `<option value="${ens.idUser}">${ens.nom} ${ens.prenom}</option>`
                                if(ens.idUser == modData.enseignantID){
                                    np = `${ens.nom} ${ens.prenom}`
                                    newData.push(ens.idUser)
                                }
                            })
                            htmlToAdd +=`    </select>
                                <p class="notInEditMode">${np}</p>
                            </div>
                            `
                        }
                    }
                })
                if(!foundP){
                    htmlToAdd += `
                    <div class="normalSection moduleSubElement">
                        <p class="libelle" style="background-color:grey !important;">TP</p>
                        <select class="editModeOnly ensSelect">
                            <option value="#">pas d'enseignant</option>
                    `
                    data[5].forEach(ens => {
                        htmlToAdd += `<option value="${ens.idUser}">${ens.nom} ${ens.prenom}</option>`
                    })
                    newData.push("#")
                    htmlToAdd +=`    </select>
                        <p class="notInEditMode">pas d'enseignant</p>
                    </div>
                    `
                }
                htmlToAdd += `
                <div><button class="deleteModuleBtn editModeOnly" onclick="deleteModule(event, '${mod.codeMod}')">X</button></div></div>`
                oldData.push(newData)
            })
            htmlToAdd += `<button class="editModeOnly" id="ajouterModuleBtn">Ajouter un module</button>`
            document.getElementById("DashboardModuleDiv").innerHTML = htmlToAdd
    
        }
        document.getElementById('ajouterModuleBtn').addEventListener('click', showAjoutSection);
        socket.off("getSectionData")
    }
}



async function suprimerSection() {
    toggleBackground(false);
    suprimerConfirmPopUp = document.createElement('div');
    suprimerConfirmPopUp.classList.add('popUp');
    suprimerConfirmPopUp.classList.add('smallMsgPopUp');
    suprimerConfirmPopUp.innerHTML = `
    <h3>Etes vous sur de vouloire suprmier la section ?</h3>
    <div class="confirmDialog">
    <button onclick="cancelSupression()">Annuler</button>
    <button onclick="confirmSuppr()">Supprimer</button>
    </div>`
    document.body.appendChild(suprimerConfirmPopUp)

    await new Promise(resolve => {setTimeout(resolve, 20)});
    suprimerConfirmPopUp.classList.add('popUpVisible')
}

async function cancelSupression() {
    toggleBackground(true);
    popUpToRemove = document.querySelector('.popUp').remove()
    popUpToRemove.classList.remove('popUpVisible')
    popUpToRemove.remove();
}
async function confirmSuppr(){
    socket.emit("suprimerSection", document.querySelectorAll('.selected_module')[0].id);
    socket.on("success", s => {
        cancelSupression()
        location.reload()
    })
}


async function showDetail(type) {
    toggleBackground(false);
    suprimerConfirmPopUp = document.createElement('div');
    suprimerConfirmPopUp.classList.add('popUp');
    suprimerConfirmPopUp.classList.add('smallMsgPopUp');
    suprimerConfirmPopUp.innerHTML = `
    <h3>Etes vous sur de vouloire suprmier la section ?</h3>
    `
    document.body.appendChild(suprimerConfirmPopUp)

    await new Promise(resolve => {setTimeout(resolve, 20)});
    suprimerConfirmPopUp.classList.add('popUpVisible')
}


function openListeSite(){
    // open a new tab with the liste site
    window.open(`/listeEtudiants?section=${document.querySelectorAll('.selected_module')[0].id}`, "_blank");
}
function openEDTSite(){
    window.open(`/edt?id=${document.querySelectorAll('.selected_module')[0].id}`, "_blank");
}

function editNomSpe(){
    specialite_v = document.getElementById("secSpe").value
    editNom()
}
function editNomAnn(){
    annee_v = document.getElementById("secAnn").value
    editNom()
}
function editNomInd(){
    indice_v = document.getElementById("secInd").value
    editNom()
}


function editNom(){
    console.log(annee_v);
    document.getElementById("secName").value = (annee_v<=3 ? "L" : "M") + (annee_v <= 3 ? annee_v : annee_v-3) + ` `+specialite_v +` `+indice_v
}