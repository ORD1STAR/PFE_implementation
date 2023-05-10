
// const popUpBackground = document.getElementById("popUpBackground");
// const leftMenu = document.getElementById('leftMenu');
// const imgBtnToogleMenu = document.getElementById('imgBtnToogleMenu');



// filtre select
//console.log(document.getElementById("filtreDiv"));
//const filtreBtns = Array.from(document.getElementById("filtreDiv").children);
//filtreBtns.shift(); // removing "Filter" text (getting buttons only)
//filtreBtns.forEach(filtreBtn => {
//    filtreBtn.addEventListener('click', () => {
//        filtreBtn.classList.toggle("filterSelected");
//    })
//})


// fonction qui retourne les filtres utilisés en liste
function getFilters() {
    usedFilters = [];
    filtreBtns.forEach((element) => {
        if (element.classList.contains("filterSelected")) {
            usedFilters.push(element.innerHTML)
        }
    })
    return usedFilters
}





// Toggle background function
popUpBackground = document.getElementById("popUpBackground");

function toggleBackground(isBackgroundShown) {
    // isShown = true => remove background
    // isShown = false => show background
    if (isBackgroundShown) {
        popUpBackground.style.display = "none";
        popUpBackground.style.pointerEvents = "none";
    } else {
        popUpBackground.style.display = "block";
        popUpBackground.style.pointerEvents = "all";
    }
};

toggleBackground(true)



// import { toggleBackground } from "./main";
// console.log("test");
// toggleBackground(false)





// show comment section

 commentSection = document.getElementById("commentSectionDiv");
 comments = document.getElementById("comments")
function showCommentSection(postID) {
    socket.emit("showComms", postID)
    socket.on("getComms", (data) => {
    comments.innerHTML = ""
        for(var i = 0; i < data.length; i++) {
            comments.innerHTML += `
            <div class="commentElement">
                <div class="commenterImg"></div>
                <div class="commenterComment">
                    <h3>${data[i]["login"]}</h3>
                    <p>${data[i]["content"]}</p>
                </div>
            </div>
            `
        }
        

        commentSection.classList.add('popUpVisible')
        document.getElementById("sendcommButt").setAttribute("onclick", `addComment(${postID})`)
        toggleBackground(false)
    })
    
}

function hideCommentSection() {
    commentSection.classList.remove('popUpVisible')
    toggleBackground(true)
}

function addComment(postID) {
    if(document.getElementById("commentWritingSection").value != ""){
        socket.emit("sendComment", [document.cookie.split("=")[1], document.getElementById("commentWritingSection").value, postID])
        socket.on("setComment", (sender) =>  {
    
            commentContainer = commentSection.children[1];
            let newCommentElement = document.createElement('div');
            newCommentElement.innerHTML = `<div class="commentElement">
                                            <div class="commenterImg"></div>
                                            <div class="commenterComment">
                                                <h3>${sender}</h3>
                                                <p>${document.getElementById("commentWritingSection").value}</p>
                                            </div>
                                           </div>`
            commentContainer.prepend(newCommentElement)
            document.getElementById("commentWritingSection").value = ""
    
        })
    }
}



// prof-side post option
const profSideOptionBtns = document.querySelectorAll('.profSideOption');
var isPieceJointeActive = false;
var isCommentsActive = true;
var isTravailActive = false;


// toggle piece jointe btn
function togglePieceJointes() {
    isPieceJointeActive = !isPieceJointeActive;
    profSideOptionBtns[1].textContent = "Piéce jointe " + (isPieceJointeActive ? "(V)" : "(X)");

    // showing / hiding pieceJointe Section
    if (isPieceJointeActive) {
        console.log("show piece jointe div")
    }
}

//profSideOptionBtns[1].addEventListener('click', togglePieceJointes)


// Drive, messagerie, Notes btns changing place when scroll
const optionPosts = document.querySelector('.categorieDiv');
const optionPostsHTML = optionPosts.innerHTML;

function isVisible(element) {
    let bordures = element.getBoundingClientRect();
    return(bordures.bottom > 0)
}

var optionDivVisible = true;
const rightOptionPosts = document.querySelector('.rightPart .categorieDiv');

document.addEventListener('scroll', () => {
    optionDivVisibleOLD = optionDivVisible
    optionDivVisible = isVisible(optionPosts)
    
    if (optionDivVisible != optionDivVisibleOLD) {
        if (optionDivVisible) {
            rightOptionPosts.classList.remove('visibleCategorieDiv')
        } else {
            rightOptionPosts.classList.add('visibleCategorieDiv')
        }
    }
})