
const modulesDiv = document.getElementById('DashboardModuleDiv');

const ajouterModuleBtn = document.getElementById('ajouterModuleBtn');
ajouterModuleBtn.addEventListener('click', showAjoutSection);

const moduleCreationHTML = `
<input type='text' placeholder='nom module'>
<div class="normalSection moduleSubElement">
    <p class="libelle">Cour</p>
    <select>
        <option value="">pas d'enseignant</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
    </select>
</div>
<div class="normalSection moduleSubElement">
    <p class="libelle">TD</p>
    <select>
        <option value="">pas d'enseignant</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
    </select>
</div>
<div class="normalSection moduleSubElement">
    <p class="libelle">TP</p>
    <select>
        <option value="">pas d'enseignant</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
        <option value="">M.Belkhir kader</option>
    </select>
</div>
<div class="moduleSubElement ajoutElement">
    <button onclick='cancelAjoutModule()'>Annuler</button>
    <button onclick='confirmerAjout()'>Ajouter</button>
</div>
`





async function showAjoutSection() {
    ajouterModuleBtn.style.display = 'none';
    
    ajoutModuleElement = document.createElement('div');
    ajoutModuleElement.classList.add('normalSection');
    ajoutModuleElement.classList.add('DashboardModuleElement');
    ajoutModuleElement.classList.add('ElementToAdd');
    ajoutModuleElement.innerHTML = moduleCreationHTML;
    modulesDiv.insertBefore(ajoutModuleElement, ajouterModuleBtn);
    ajoutModuleElement.classList.add('zeroHeight');
    
    await new Promise(r => setTimeout(r, 20));
    ajoutModuleElement.classList.remove('zeroHeight');
}



async function cancelAjoutModule() {
    try {
        ajouterModuleBtn.style.display = 'block'
        elementToAdd = document.querySelector('.ElementToAdd');
        elementToAdd.classList.add('zeroHeight');
        await new Promise(r => setTimeout(r, 250));
        elementToAdd.remove();
    } catch {}
}


var tempModules = [];

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

async function deleteModule(event) {
    moduleToDelete = event.target.parentElement.parentElement;
    moduleToDeleteArr.push(moduleToDelete);
    moduleToDelete.classList.add('zeroHeight');
    await new Promise(r => setTimeout(r, 200));
    moduleToDelete.remove();
}








//      Edit Mode

const mainWrapper = document.getElementById('mainWrapper');

function DashboardSwitchToEdit() {
    mainWrapper.classList.add('DashboardEditMode');
    ajouterModuleBtn.style.display = 'block';

}

function DashboardSwitchToNormal() {
    mainWrapper.classList.remove('DashboardEditMode');
    cancelAjoutModule();
    
    // supprimer les modules ajoutés mais pas confirmés
    tempModules.forEach(element => {
        element.remove();
    })
    ajouterModuleBtn.style.display = 'none';
    
}


// edit mode confirm

function confirmEdit() {
    tempModules = [];        // ajouter tt dans la bdd
    moduleToDeleteArr = []   // supprimer tt de la bdd

    DashboardSwitchToNormal();
}













// notInCreation
// inCreationModeOnly



//      Switch to creation

function switchToCreation() {
    // annuler tout les edits en cours
    DashboardSwitchToNormal();
    DashboardSwitchToEdit();

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

    mainWrapper.classList.remove('CreationMode')
}
