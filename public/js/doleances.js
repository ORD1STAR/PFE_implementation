
const deleteDoleanceBtns = document.querySelectorAll('.deleteDoleanceBtn');

function deleteDoleance(e) {
    e.target.parentElement.remove();
}