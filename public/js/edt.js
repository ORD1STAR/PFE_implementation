
function addSimpleCase(where, type, module, classe){
    return `
    <td id="${where}"><div class="EDTcase">
        <div class="EDT_module">
            <div class="moduleContent">
                <div class="moduleTitleDiv">
                    ${type == "Cours" ? "" : `<p class="moduleType">${type}</p>`}
                    <p class="moduleTitle">${module}</p>
                </div>
                <p class="moduleClass">${classe}</p>
            </div>
        </div>
    </div></td>
    `
}

function addSimpleGroupedCase(where, type, groups, module, classe){
    grp = ""
    for(g in groups){
        grp += `<p>${g}</p>`
    }
    return `
    <td id="${where}"><div class="EDTcase">
        <div class="EDT_module">
            <div class="moduleGroupes">${grp}</div>
            <div class="moduleContent">
                <div class="moduleTitleDiv">
                    ${type == "Cours" ? "" : `<p class="moduleType">${type}</p>`}
                    <p class="moduleTitle">${module}</p>
                </div>
                <p class="moduleClass">${classe}</p>
            </div>
        </div>
    </div></td>
    `
}

function addMultiGroupedCase(where, types, groups, modules, classes){

    final = `<td id="${where}"><div class="EDTcase">`
    for(var i = 0; i < modules.length; i++){
        grp = ""
        for(g in groups[i]){
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
    
}
token = ""
    cookies = document.cookie.split('; ')
    cookies.forEach(function(c){
        if(c.startsWith('token=')){
            token = c.split('=')[1]
        }
    })
socket.emit("getEDT", token)
socket.on("getEDT", (data) => { 

    if(data){
        const blob = new Blob([data[0]]);
        const fileReader = new FileReader();

        fileReader.onload = function(event) {
          const arrayBuffer = event.target.result;
          const workbook = XLSX.read(arrayBuffer, {type: 'array'});
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(sheet);
          console.log(data);
        };

        fileReader.readAsArrayBuffer(blob);


        //file = data[0].decode("utf-8")
        //console.log(file);
    
        edtTable = document.getElementById('EDT')
        days = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"]
    
        for(day of days){
            edtTable.innerHTML += `
            <tr>
                <td>${day}</td>
                <td id="sam1"></td>
                <td id="sam2"></td>
                <td id="sam3"></td>
                <td id="sam4"></td>
                <td id="sam5"></td>
                <td id="sam6"></td>
            </tr>
            `
        
        }
    }
})
