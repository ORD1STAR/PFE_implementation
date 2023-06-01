
// GROUPS|TYPE|MODULE|CLASS


function addSimpleCase(where, type, module, classe){
    return `
                    <td>
                        <div class="EDTcase">
                            <div class="EDT_module">
                                <div class="moduleContent">
                                    <div class="moduleTitleDiv">
                                        <p class="moduleType">${type}</p>
                                        <p class="moduleTitle">${module}</p>
                                    </div>
                                    <p class="moduleClass">${classe}</p>
                                </div>
                            </div>
                        </div>
                    </td>
    `
}

function addSimpleGroupedCase(where, type, groups, module, classe){
    grp = ""
    for(g of groups){
        grp += `<p>${g}</p>`
    }
    return `
    <td id="${where}">
        <div class="EDTcase">
            <div class="EDT_module">
                <div class="moduleGroupes">${grp}</div>
                <div class="moduleContent">
                    <div class="moduleTitleDiv">
                        <p class="moduleType">${type}</p>
                        <p class="moduleTitle">${module}</p>
                    </div>
                    <p class="moduleClass">${classe}</p>
                </div>
            </div>
        </div>
    </td>
    `
}

function addMultiGroupedCase(where, types, groups, modules, classes){

    final = `<td id="${where}"><div class="EDTcase">`
    for(var i = 0; i < modules.length; i++){
        grp = ""
        for(g of groups[i]){
            grp += `<p>${g}</p>`
        }
        final += `
        <div class="EDT_module">
            <div class="moduleGroupes">${grp}</div>
            <div class="moduleContent">
                <div class="moduleTitleDiv">
                    <p class="moduleType">${types[i]}</p>
                    <p class="moduleTitle">${modules[i]}</p>
                </div>
                <p class="moduleClass">${classes[i]}</p>
            </div>
        </div>
        `
    }

    final += `</div></td>`
    return final
}
token = ""
    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })

function getEDTetu(){
    socket.emit("getEDT", token)

    socket.on("getEDT", (data) => { 
        if(data == "empty"){
            document.getElementById("EDT").innerHTML = "<p>Vous n'avez pas d'emploi du temps</p>"
        }else{
            if(data.length != 6){
                for(var i = data.length; i < 6; i++){
                    data.push(["///", "///", "///", "///", "///", "///"])
                }
            }
            for(var i = 0; i < 6; i++){ 
                if(data[i].length != 6){
                    for(var j = data[i].length; j < 6; j++){
                        data[i].push("///")
                    }
                }
            }
            edtHTML = `<tr>
                <th></th>
                <th>8h 9h30</th>
                <th>9h40 11h10</th>
                <th>11h20 12h50</th>
                <th>13h 14h30</th>
                <th>14h40 16h10</th>
                <th>16h20 17h50</th>
            </tr>`
            for(var row = 0; row < 6; row++){
                edtHTML += `<tr><td>${row == 0 ? "samedi" : row == 1 ? "dimanche" : row == 2 ? "lundi" : row == 3 ? "mardi" : row == 4 ? "mercredi" : "jeudi"}</td>`
                for(var col = 0; col< data[row].length; col++){
                    if(data[row][col] == "///"){
                        edtHTML += "<td></td>"
                    }else{
                        seances = data[row][col].split("#")

                        if(seances.length == 1){
                            jour = seances[0].split("|")
                            groups = jour[0] != "" ? jour[0].split(";") : ""
                            type = jour[1]
                            module = jour[2]
                            classe = jour[3]
                            if(groups == ""){
                                edtHTML += addSimpleCase(row, type, module, classe)
                            }else{
                                edtHTML += addSimpleGroupedCase(row, type, groups, module, classe)
                            }   

                        }else{
                            var Ftypes = [], Fgroups = [], Fmodules = [], Fclasses = []
                            for(var i = 0; i < seances.length; i++){
                                jour = seances[i].split("|")
                                groups = jour[0] != "" ? jour[0].split(";") : ""
                                type = jour[1]
                                module = jour[2]
                                classe = jour[3]

                                Ftypes.push(type)
                                Fmodules.push(module)
                                Fclasses.push(classe)
                                Fgroups.push(groups)

                            }
                            edtHTML += addMultiGroupedCase(row, Ftypes, Fgroups, Fmodules, Fclasses)
                        }
                    }
                }
                edtHTML += "</tr>"
            }

            document.getElementById("EDT").innerHTML = edtHTML
        } 
    })
}

function getEDTadm(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    socket.emit("getEDTADM", id)

    socket.on("getEDTADM", (data) => { 
        if(data == "empty"){
            document.getElementById("EDT").innerHTML = "<p>Vous n'avez pas d'emploi du temps</p>"
        }else{
            if(data.length != 6){
                for(var i = data.length; i < 6; i++){
                    data.push(["///", "///", "///", "///", "///", "///"])
                }
            }
            for(var i = 0; i < 6; i++){ 
                if(data[i].length != 6){
                    for(var j = data[i].length; j < 6; j++){
                        data[i].push("///")
                    }
                }
            }
            edtHTML = `<tr>
                <th></th>
                <th>8h 9h30</th>
                <th>9h40 11h10</th>
                <th>11h20 12h50</th>
                <th>13h 14h30</th>
                <th>14h40 16h10</th>
                <th>16h20 17h50</th>
            </tr>`
            for(var row = 0; row < 6; row++){
                edtHTML += `<tr><td>${row == 0 ? "samedi" : row == 1 ? "dimanche" : row == 2 ? "lundi" : row == 3 ? "mardi" : row == 4 ? "mercredi" : "jeudi"}</td>`
                for(var col = 0; col< data[row].length; col++){
                    if(data[row][col] == "///"){
                        edtHTML += "<td></td>"
                    }else{
                        seances = data[row][col].split("#")

                        if(seances.length == 1){
                            jour = seances[0].split("|")
                            groups = jour[0] != "" ? jour[0].split(";") : ""
                            type = jour[1]
                            module = jour[2]
                            classe = jour[3]
                            if(groups == ""){
                                edtHTML += addSimpleCase(row, type, module, classe)
                            }else{
                                edtHTML += addSimpleGroupedCase(row, type, groups, module, classe)
                            }   

                        }else{
                            var Ftypes = [], Fgroups = [], Fmodules = [], Fclasses = []
                            for(var i = 0; i < seances.length; i++){
                                jour = seances[i].split("|")
                                groups = jour[0] != "" ? jour[0].split(";") : ""
                                type = jour[1]
                                module = jour[2]
                                classe = jour[3]

                                Ftypes.push(type)
                                Fmodules.push(module)
                                Fclasses.push(classe)
                                Fgroups.push(groups)

                            }
                            edtHTML += addMultiGroupedCase(row, Ftypes, Fgroups, Fmodules, Fclasses)
                        }
                    }
                }
                edtHTML += "</tr>"
            }

            document.getElementById("EDT").innerHTML = edtHTML
        } 
    })
}