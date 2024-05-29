function handleSubmit(event) {
    event.preventDefault();
    fazerLogin();
}

async function fazerLogin(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const jsonData = {
        usuario: username,
        senha: password
    }
    const jsonDataStringfy = JSON.stringify(jsonData);
    response = await fetch("/login/authenticate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
        },
        body: jsonDataStringfy
    })
    if(response.ok){
        window.location.href = "/";
    } else {
        console.error('Erro ao atualizar produto:', response.statusText);
    }
}