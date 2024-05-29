document.addEventListener('DOMContentLoaded', async () => {
    if(await isAdmin2()){
        console.log("chegou aqui")
        document.querySelectorAll(".setores").forEach( item => {
            item.style.display = "flex";
        });
    } else {
        const acessos = getCookie('acessos');
        acessos.split(".").forEach(acesso => {
            if(acesso){
                document.getElementById(acesso).style.display = "flex";
            }
        });
    }
});

function isAdmin2(){
    fetch("/admin-cookie")
    .then(response => response.json())
    .then(data => {
        if(data.message === 'admin'){
            return true;
        };
    });
}

function getCookie(cookie){
    const listaCookies = document.cookie.split(';');
    for( i = 0 ; i < listaCookies.length ; i++ ){
        const cookiePair = listaCookies[i].trim();
        if (cookiePair.startsWith(cookie + '=')) {
            return cookiePair.split('=')[1];
        }
    }
}