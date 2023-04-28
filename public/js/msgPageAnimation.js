
// module menus animation
const moduleElements = document.querySelectorAll(".TPTDmoduleSection")

moduleElements.forEach(element => {
    element.addEventListener("click", () => {
        element.classList.toggle("closed")
        element.children[2].classList.toggle("animateFadeIn")
        element.children[3].classList.toggle("animateFadeIn")
        element.children[4].classList.toggle("animateFadeIn")
    })
})


// making the message scroll to bottom
const msgContainerDiv = document.querySelector(".msgContainer")
msgContainerDiv.scrollTop = msgContainerDiv.scrollHeight - msgContainerDiv.offsetHeight;




// Message Writing Function

function writeMsg(msgToWrite, owner) {
    // removing the old vide message
    let msgLineVide = document.getElementsByClassName("msgLineVide")[0]
    msgContainerDiv.removeChild(msgLineVide)
    
    // getting previous msg + previous message owner
    let PreviousMsg = document.querySelector(".msgLine:last-child")
    msgTxtDiv = PreviousMsg.lastElementChild
    
    if (PreviousMsg.classList.contains("firstMsg")) {
        PreviousMsgOwner = 2
    } else if (PreviousMsg.classList.contains("ownMsgLine")) {
        PreviousMsgOwner = 0
    } else {
        PreviousMsgOwner = 1
    }

    if (PreviousMsgOwner == owner) {
        // creating the msg Text Div
        newMsg = document.createElement("p")
        newMsg.innerHTML = msgToWrite
        msgTxtDiv.appendChild(newMsg)
    } else {
        // creating the msgLine Div
        msgLineDiv = document.createElement("div")
        msgLineDiv.classList.add("msgLine")
        if (owner == 0) {msgLineDiv.classList.add("ownMsgLine")}
        msgContainerDiv.appendChild(msgLineDiv)
        
        // creating the icon
        msgIcon = document.createElement("div")
        msgIcon.classList.add("msgerIcon")
        msgLineDiv.appendChild(msgIcon)
        
        // creating the msg Text Div
        msgTxtDiv = document.createElement("div")
        msgTxtDiv.classList.add("msgTxt")
        msgLineDiv.appendChild(msgTxtDiv)
        
        // creating the msg Text Div
        newMsg = document.createElement("p")
        newMsg.innerHTML = msgToWrite
        msgTxtDiv.appendChild(newMsg)
    }
    
    // adding the empty vide message after the new msg
    msgLineVide = document.createElement("div")
    msgLineVide.classList.add("msgLineVide")
    msgContainerDiv.appendChild(msgLineVide)
    
    msgContainerDiv.scrollTop = msgContainerDiv.scrollHeight - msgContainerDiv.offsetHeight;
}















// Getting the message to write from input + calling writeMsg()

const sendBtn = document.getElementById("sendBtn")
sendBtn.addEventListener("click", () => {
    // getting the test to write
    let textEntry = document.getElementById("textEntry").value
    if (textEntry == "") {return}

    writeMsg(textEntry, 0)

    // suprimer le text écrit
    document.getElementById("textEntry").value = null
})

const PJbtn = document.getElementById("PJbtn")
PJbtn.addEventListener("click", () => {
    // getting the test to write
    let textEntry = document.getElementById("textEntry").value
    if (textEntry == "") {return}

    writeMsg(textEntry, 1)

    // suprimer le text écrit
    document.getElementById("textEntry").value = null
})





// TD TP Cours Select

const TPTDselectBtns = document.querySelectorAll(".TPTDselectBtn")
TPTDselectBtns.forEach(selectBtn => {
    selectBtn.addEventListener("click", (e) => {
        TPTDselectBtns.forEach(btn => {
            btn.classList.remove("selected_TPTD")
        });
        selectBtn.classList.add("selected_TPTD")
    })
});





// Contact Section M0BIL3

const contactSection = document.getElementById("contactSection");
const contactSectionBtn = document.getElementById("contactBtnToggleMenu");

contactSectionBtn.addEventListener('click', () => {
    contactSection.classList.toggle("contactSectionVisible")
})