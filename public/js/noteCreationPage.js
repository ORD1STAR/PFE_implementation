
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
    <input type="text" id="newTitle">
</div>
<div class="noteSlotElementElement">
    <h3>Note maximale</h3>
    <input type="number" id="newMax">
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

function addConfirm(mod){
    title = document.getElementById('newTitle').value;
    noteMax = document.getElementById('newMax').value;
    methode = document.getElementById("methode").value != "Vous n'avez pas définie une méthode de calcule des moyennes" ? document.getElementById("methode").value : ""
    if (title != '' && noteMax != '') {
        socket.emit("addNote", {module:mod, title: title, noteMax: noteMax, methode});
        socket.on("success", (s) => {
            if(s == 1){
                cancelAjout()
            }
        })
    }
}

function editConfirm(mod){
    allOldNames = document.querySelectorAll(".notesName")
    allOldMaxs = document.querySelectorAll(".notesMax")
    allNewNames = document.querySelectorAll(".editedName")
    allNewMaxs = document.querySelectorAll(".editedMax")

    names =[]
    allOldNames.forEach(function callback(name, i){
        names.push([name.innerHTML, allNewNames[i].value])
    });

    maxs =[]
    allOldMaxs.forEach(function callback(note, i){
        maxs.push([note.innerHTML, allNewMaxs[i].value])

    })

    nameToEdit = []
    names.forEach(function callback(name, i){
        oldN = name[0]
        newN = name[1]

        if(oldN != newN){
            nameToEdit.push([oldN, newN, maxs[i][0]])
        }
    })
    maxToEdit = []
    maxs.forEach(function callback(max, i){
        oldM = max[0]
        newM = max[1]

        if(oldM != newM){
            maxToEdit.push([oldM, newM, names[i][1]])
        }
    })

    socket.emit("updateNotes", nameToEdit, maxToEdit, mod)
    socket.on("success", (s) => {
        if(s == 1){
            switchToNormalMode()

            allOldNames.forEach(function callback(name, i){
                name.innerHTML = allNewNames[i].value
            });
            allOldMaxs.forEach(function callback(note, i){
                note.innerHTML = allNewMaxs[i].value
        
            })
        }
    })
}

function methodeConfirm(mod){
    methode = document.getElementById("methode").value
    console.log(methode);
    if(methode != ""){
        socket.emit("addMethode", methode, mod)
        socket.on("success", (e) => {
            if(e==1){
                methodeSwitchToNormal()
                document.getElementById("methodeTxt").innerHTML = methode
            }
        })
    }
}
//  <div class="affectationNoteElement">
//    <div class="profilePicDiv"></div>
//    <div class="informationEtudiant">
//        <h3>xxxxxxxxxxxxxxx yyyyyyy</h3>
//        <p>2020123456789</p>
//    </div>
//    <input type="number" value="15">
//    <h3>/20</h3>
//  </div>
//  <button>Enregister</button>
function getNotesEtudiants(mod){
    selected = document.getElementById("notesS").value
    socket.emit("getEtudiants", mod, selected)
    socket.on("getEtudiants", (etudiants) => {
        html = ""
        etudiants.forEach(e => {

        })
    })
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