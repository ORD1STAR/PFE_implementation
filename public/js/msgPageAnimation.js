
// module menus animation
// const moduleElements = document.querySelectorAll(".TPTDmoduleSection")
// 
// moduleElements.forEach(element => {
//     element.addEventListener("click", () => {
//         element.classList.toggle("closed")
//         element.children[2].classList.toggle("animateFadeIn")
//         element.children[3].classList.toggle("animateFadeIn")
//         element.children[4].classList.toggle("animateFadeIn")
//     })
// })


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

    //add the message in the data base, for that we will send a socket to the server
    socket.emit("addMessage", [document.cookie.split("=")[1], document.getElementById("discutID").classList[0], textEntry, document.getElementById("nomProf").innerHTML])

    writeMsg(textEntry, 0)

    // suprimer le text écrit
    document.getElementById("textEntry").value = null
})






// TD TP Cours Select

//const TPTDselectBtns = document.querySelectorAll(".TPTDselectBtn")
//TPTDselectBtns.forEach(selectBtn => {
//    selectBtn.addEventListener("click", (e) => {
//        TPTDselectBtns.forEach(btn => {
//            btn.classList.remove("selected_TPTD")
//        });
//        selectBtn.classList.add("selected_TPTD")
//    })
//});





// Contact Section M0BIL3

const contactSection = document.getElementById("contactSection");
//const contactSectionBtn = document.getElementById("contactBtnToggleMenu");
//
//contactSectionBtn.addEventListener('click', () => {
//    contactSection.classList.toggle("contactSectionVisible")
//})

function openChat(login, module, type){
    token = document.cookie.split("=")[1]

    if(type==1){
        const TPTDselectBtns = document.querySelectorAll(".TPTDselectBtn")
        TPTDselectBtns.forEach(selectBtn => {
            selectBtn.classList.remove("selected_TPTD")
        })
        document.getElementById("C").classList.add("selected_TPTD")
        
    }else if(type==2){
        const TPTDselectBtns = document.querySelectorAll(".TPTDselectBtn")
        TPTDselectBtns.forEach(selectBtn => {
            selectBtn.classList.remove("selected_TPTD")
        })
        document.getElementById("D").classList.add("selected_TPTD")
    }else{
        const TPTDselectBtns = document.querySelectorAll(".TPTDselectBtn")
        TPTDselectBtns.forEach(selectBtn => {
            selectBtn.classList.remove("selected_TPTD")
        })
        document.getElementById("P").classList.add("selected_TPTD")
    }

    socket.emit("getChat", [token, login])
    socket.on("getChat", (data) => {
        if(data[0] != "empty"){
            discutID = data[0][0]["discussionID"]
            document.getElementById("discutID").classList = discutID
            let msgContainerDiv = document.getElementById("msgContainer");
            
            msgContainerDiv.innerHTML = `
            <div class="msgLine firstMsg">
                <div class="msgTxt">
                    <p>Début de la discussion</p>
                </div>
            </div>
            <div class="msgLineVide"></div>`
            document.getElementById("nomProf").innerHTML = login
            document.getElementById("moduleName").innerHTML = module
            for(var message of data[0]){
                if(message["sender"] == data[1]){
                    writeMsg(message["contenu"], 0)
                }else{
                    writeMsg(message["contenu"], 1)
                }
            }
        }else{
            document.getElementById("discutID").classList = data[1]
            let msgContainerDiv = document.getElementById("msgContainer");

            document.getElementById("nomProf").innerHTML = login
            document.getElementById("moduleName").innerHTML = module
            msgContainerDiv.innerHTML = `
            <div class="msgLine firstMsg">
                <div class="msgTxt">
                    <p>Début de la discussion</p>
                </div>
            </div>
            <div class="msgLineVide"></div>`
        }
    })

}
function openChatE(hisLogin, module, type){
    myToken = document.cookie.split("=")[1]

    if(type==1){
        const TPTDselectBtns = document.querySelectorAll(".TPTDselectBtn")
        TPTDselectBtns.forEach(selectBtn => {
            selectBtn.classList.remove("selected_TPTD")
        })
        document.getElementById("C").classList.add("selected_TPTD")
        
    }else if(type==2){
        const TPTDselectBtns = document.querySelectorAll(".TPTDselectBtn")
        TPTDselectBtns.forEach(selectBtn => {
            selectBtn.classList.remove("selected_TPTD")
        })
        document.getElementById("D").classList.add("selected_TPTD")
    }else{
        const TPTDselectBtns = document.querySelectorAll(".TPTDselectBtn")
        TPTDselectBtns.forEach(selectBtn => {
            selectBtn.classList.remove("selected_TPTD")
        })
        document.getElementById("P").classList.add("selected_TPTD")
    }

    socket.emit("getChat", [myToken, hisLogin])
    socket.on("getChat", (data) => {
        if(data[0] != "empty"){
            discutID = data[0][0]["discussionID"]
            document.getElementById("discutID").classList = discutID
            let msgContainerDiv = document.getElementById("msgContainer");
            
            msgContainerDiv.innerHTML = `
            <div class="msgLine firstMsg">
                <div class="msgTxt">
                    <p>Début de la discussion</p>
                </div>
            </div>
            <div class="msgLineVide"></div>`
            document.getElementById("nomProf").innerHTML = hisLogin
            document.getElementById("moduleName").innerHTML = module
            for(var message of data[0]){
                if(message["sender"] == data[1]){
                    writeMsg(message["contenu"], 0)
                }else{
                    writeMsg(message["contenu"], 1)
                }
            }
        }else{
            document.getElementById("discutID").classList = data[1]
            let msgContainerDiv = document.getElementById("msgContainer");

            msgContainerDiv.innerHTML = `
            <div class="msgLine firstMsg">
                <div class="msgTxt">
                    <p>Début de la discussion</p>
                </div>
            </div>
            <div class="msgLineVide"></div>`
        }
    })

}

socket.on("recvMessage", (data) => {
    hisLogin = data[0]
    centent = data[1]

    if(document.getElementById("nomProf").innerHTML == hisLogin){
        writeMsg(centent, 1)
    }

})