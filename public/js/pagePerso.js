
const profileWrapper = document.querySelector('.profileWrapper');

function switchToProfileEditMode() {
    profileWrapper.classList.add('profileEditMode')
}

function hidePorfileEditMode() {
    profileWrapper.classList.remove('profileEditMode')
}






//BACK 
document.getElementById('fileInput').addEventListener("change", function(){

    //display the image in the img with id "pdpC"

    var img = this.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', function() {
      document.getElementById("pdpC").src = reader.result;
    });
    reader.readAsDataURL(img);

    token = ""
    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })
    socket.emit("changePDP", [token, img])
    socket.on("success", (b) => {
        if(b == 1){
            document.getElementById("pdp").src = reader.result;
        }
    })
})
document.getElementById('submit').addEventListener("click", function(){

    newNum = document.getElementById("inNum").value
    newMail = document.getElementById("inMail").value
    mdp = document.getElementById("inMDP").value
    newMdp = document.getElementById("inNMDP").value

    token = ""
    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })

    socket.emit("changeInfo", [token, newNum, newMail, mdp, newMdp])
    socket.on("success", (suc) => {
        if(suc == 0){
            document.getElementById("error").style.display = "block"
        }else if(suc == 1){
            document.getElementById("error").style.display = "none"
            if(newNum) document.getElementById("cNum").innerHTML = newNum; document.getElementById("inNum").value = ""
            if(newMail) document.getElementById("cMail").innerHTML = newMail;document.getElementById("inMail").value = ""
            document.getElementById("inMDP").value = ""
            document.getElementById("inNMDP").value = ""
            hidePorfileEditMode()
        }
    })

})


function changePDP(){
    document.getElementById('fileInput').click();
}


function dolSend(){
    token = ""
    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })

    socket.emit("dolSend", [token, document.getElementById("title").value, document.getElementById("content").value])
    document.getElementById("title").value = ""
    document.getElementById("content").value = ""
}