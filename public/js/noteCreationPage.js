
const containerCreation = document.querySelector('.adminNotesContainer');
const methodeDeCalcDiv = document.getElementById('methodeDeCalcule');

const affectationSection = document.querySelector('.affectationWrapper');
const affectationSelectSection = document.querySelector('.affectationSelect');

const selectBtns = document.querySelectorAll('.createAffectationBtn');

function switchCreationAffectation(section) {
    if (section == 'affectation') {
        selectBtns[0].classList.remove('selectedBtn');
        selectBtns[1].classList.add('selectedBtn');
        
        containerCreation.classList.add('sectionIsHidden');
        methodeDeCalcDiv.classList.add('sectionIsHidden');
        affectationSection.classList.remove('sectionIsHidden')
        affectationSelectSection.classList.remove('sectionIsHidden')
    } else {
        selectBtns[0].classList.add('selectedBtn');
        selectBtns[1].classList.remove('selectedBtn');

        containerCreation.classList.remove('sectionIsHidden');
        methodeDeCalcDiv.classList.remove('sectionIsHidden');
        affectationSection.classList.add('sectionIsHidden')
        affectationSelectSection.classList.add('sectionIsHidden')
    }
}










// modifier les elements note

function switchToEditMode() {
    containerCreation.classList.add('isEditMode');
}

function switchToNormalMode() {
    containerCreation.classList.remove('isEditMode');
}







// ajout de note

const noteSlotElmenetHTML = `
<div class="noteSlotElementElement">
    <h3>Nom</h3>
    <p>interrogation 1</p>
    <input type="text">
</div>
<div class="noteSlotElementElement">
    <h3>Note maximale</h3>
    <p>20</p>
    <input type="number">
</div>
`
function ajouterNoteDraft() {
    newNoteElement = document.createElement('div');
    newNoteElement.innerHTML = noteSlotElmenetHTML;
    newNoteElement.classList.add('noteSlotElement');
    newNoteElement.classList.add('ajoutDraftDiv');
    containerCreation.appendChild(newNoteElement);
}

function switchToAjoutMode() {
    containerCreation.classList.add('isAjoutMode');
    ajouterNoteDraft();
}

function cancelAjout() {
    let ajoutDraft = document.querySelector('.ajoutDraftDiv');
    ajoutDraft.remove();
    containerCreation.classList.remove('isAjoutMode');
}




// méthode de calcule


function methodeSwitchToEdit() {
    methodeDeCalcDiv.classList.add('isEditMode');
}

function methodeSwitchToNormal() {
    methodeDeCalcDiv.classList.remove('isEditMode');
}