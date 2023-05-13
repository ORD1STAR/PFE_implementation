
token = ""
exam = ""
cookies = document.cookie.split('; ')
cookies.forEach(function(c){
    if(c.startsWith('token=')){
        token = c.split('=')[1]
    }
    if(c.startsWith('exam=')){
        exam = c.split('=')[1]
    }
})

socket.emit("getExam", [token, exam])
socket.on("getExam", (data)=>{
    exam = data[0][0]
    questions = data[1]
    document.getElementById("examInfo").innerHTML = `
    <h1>${exam.nom}</h1>
    <h5>${exam.login}</h5>
    <h5>Date: ${exam.date.slice(0, 10)}</h5>
    <h5>Heure: ${exam.heure.split("|").join(" → ")}</h5>
    <h5>Notation:  /${exam.maxNote}</h5>
    <h5>Coef: ${exam.coef}</h5>
    ${exam.description ? `<div class="note">
        <h5>Note de l'enseignant:</h5>
        <p>${exam.description}</p>
    </div>` : ""}
    
    `


    questionnaire = document.getElementById("questionnaire")
    questionnaire.innerHTML = ""

    questions.forEach(function(q, i){
        qcmR = q.qcm.split("|")
        qcmH = ""
        qcmR.forEach(function(r, j){
            qcmH += `
            <div class="qcm">
                <input type="checkbox" name="q${i+1}" value="${j+1}">
                <label for="q${i+1}"> ${r}</label>
            </div>`
        })
        questionnaire.innerHTML += `
        
        <div class="box">
            <div class="question">
                <p><strong><u>Question ${i+1}:</u></strong> ${q.titre}</p>
            </div>
            <div class="reponse">
                
                ${q.type == 0 ? 
                `<div class="reponse">
                    <input type="text" name="q${i+1}" placeholder="Reponse ${i+1}">
                </div>` 
                : 
                `<div class="reponse">
                    ${qcmH}
                </div>`}

            </div>
        </div>
        
        `
    })
    questionnaire.innerHTML += `<input id="repondre" type="submit" value="Envoyer vos reponses">`

})