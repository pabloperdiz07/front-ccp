document.addEventListener('DOMContentLoaded', async () => {
    const primeiroNome = await getCookie('nome');
    document.querySelectorAll(".nomeLogado").forEach(item => {
        item.textContent = primeiroNome.split('%20')[0];
    });
    await isAdmin();
    const settingsDiv = document.getElementById('settingsDiv');
    settingsDiv.onmouseover = function() {openSettingsOptions();};
    settingsDiv.onmouseout = function() {closeSettingsOptions();};
});

async function isAdmin(){
    await fetch("/admin-cookie")
    .then(response => response.json())
    .then(data => {
        if(data.message === 'admin'){
            document.querySelectorAll(".admin").forEach(item => {
                item.style.display = "flex";
            });
        };
    });
}

function getCookie(cookie){
    const listaCookies = document.cookie.split(';');
    for( i = 0 ; i < listaCookies.length ; i++ ){
        if (listaCookies[i].startsWith(cookie)){
            return listaCookies[i].split('=')[1];
        }
    }
}

window.getCookie = getCookie;

async function logout() {
    await fetch("/clear-cookie");
    location.reload();
}

function openMenuMobile() {
    document.getElementById('mobileNav').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function openSettingsOptions() {
    document.getElementById('settingsOptions').style.display = 'flex';
}

function closeSettingsOptions() {
    document.getElementById('settingsOptions').style.display = 'none';
}

function openSideFormModal(tipo = ""){
    if(tipo){
        document.getElementById("buttonSubmitForm").value = tipo
    }
    const modal = document.getElementById("sideFormModal");
    modal.style.display = "flex";
    document.body.classList.add('modal-open');
}

function cancelSideFormModal(action){
    const modal = document.getElementById("sideFormModal");
    modal.style.display = "none";
    if(action !== "manterDadosNoForm"){
        const inputs = document.querySelectorAll("#inputsSideForm input, #inputsSideForm select");
        inputs.forEach(input => {
            if (input.tagName.toLowerCase() === 'select') {
                input.selectedIndex = 0;
            } else {
                if(input.type === "checkbox"){
                    input.checked = false;
                }
                input.value = '';
            }
        });
    }
    document.body.classList.remove('modal-open');
}