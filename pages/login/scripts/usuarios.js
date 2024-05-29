document.addEventListener("DOMContentLoaded", () => {
    carregarUsuarios();
});

function carregarUsuarios() {
    fetch("/populate/usuarios")
        .then(response => response.json())
        .then(data => {
            const ulAdmin = document.getElementById("administradores");
            const ulComum = document.getElementById("comuns");
            let listItem = "";
            data.forEach(usuario => {
                listItem = `
                <li>
                    <a onclick="openModalEditUsuario(${usuario.id_usuario})">
                        <div>
                            <p> ${usuario.nome} </p>
                        </div>
                    </a>
                </li>
                `;
                if(usuario.is_admin.data[0]){
                    ulAdmin.innerHTML += listItem;
                } else {
                    ulComum.innerHTML += listItem;
                }
            });
        })
        .catch(error => console.error("Error fetching client names:", error));
};

async function novoUsuario(tipo) {
    const nome = document.getElementById("nomeUsuario").value;
    const usuario = document.getElementById("usuario").value;
    const valorSenha = document.getElementById("senha").value
    let setores = ""
    if (document.getElementById("recepcao").checked){
        setores += "recepcao."
    } 
    if (document.getElementById("comercial").checked){
        setores += "comercial."
    }
    let cidades = ""
    if (document.getElementById("salvador").checked){
        cidades += "salvador."
    } 
    if (document.getElementById("aracaju").checked){
        cidades += "aracaju."
    }
    const jsonData = {};
    jsonData["nome"] = nome;
    jsonData["usuario"] = usuario;
    jsonData["senha"] = valorSenha;
    jsonData["acessos"] = setores;
    jsonData["trabalha_em"] = cidades;
    jsonData["is_admin"] = tipo === 'admin'? 1 : 0;
    const jsonString = JSON.stringify(jsonData);
    const response = await fetch(`/api/cadastro/usuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
        },
        body: jsonString
    });
    if (response.ok) {
        // Redirecionar após a atualização
        location.reload();
    } else {
        console.error('Erro ao atualizar produto:', response.statusText);
    }
}

function openModalEditUsuario(id){
    fetch(`populate/usuarios/${id}`)
    .then(response => response.json())
    .then(dados => {
        const dadosUsuario = dados[0];
        document.getElementById("nomeUsuario").value = dadosUsuario.nome;
        document.getElementById("usuario").value = dadosUsuario.usuario;
        dadosUsuario.acessos.split(".").forEach(setor => {
            if(setor){
                document.getElementById(setor).checked = true;
            }
        });
        dadosUsuario.trabalha_em.split(".").forEach(cidade => {
            if(cidade){
                document.getElementById(cidade).checked = true;
            }
        });
        openSideFormModal();
    })
    .catch(error => console.error("Error fetching client by id:", error));
}


