document.addEventListener("DOMContentLoaded", async () => {
    let trabalhaEm = await getCookies5("trabalha_em");
    await carregarClientes(trabalhaEm);
    trabalhaEm.split(".").forEach(cidade => {
        if(cidade){
            document.getElementById(cidade).style.display = 'block'
        }
    });
});

function getCookies5(cookie){
    const listaCookies = document.cookie.split(';');
    for( i = 0 ; i < listaCookies.length ; i++ ){
        const cookiePair = listaCookies[i].trim();
        if (cookiePair.startsWith(cookie + '=')) {
            return cookiePair.split('=')[1];
        }
    }
}

function carregarClientes(cidades,ultimoCliente = 0) {
    fetch(`/populate/clientes/${cidades}/${ultimoCliente}`)
        .then(response => response.json())
        .then(data => {
            const quantidadeMaxima = 10;
            if(data.length <= quantidadeMaxima){
                document.getElementById('buttonVerMais').style.display = 'none';
            } else {
                document.getElementById('buttonVerMais').style.display = 'flex';
            }
            const ul = document.getElementById("clientes-list");
            data.forEach(cliente => {
                const li = document.createElement("li");
                li.innerHTML = `
                <a id="${cliente.id_paciente}" href="/paciente?id=${cliente.id_paciente}">
                    <div>
                        <p> ${cliente.nome} </p>
                        <p> ${cliente.cidade_de_atendimento} </p>
                    </div>
                </a>`;
                ul.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching client names:", error));
};

async function verMaisClientes() {
    const ultimoIdClienteElement = document.querySelector("#clientes-list > li:last-child > a");
    if (ultimoIdClienteElement) {
        const ultimoCliente = ultimoIdClienteElement.id;
        const cidades = await getCookies5("trabalha_em");
        await carregarClientes(cidades, ultimoCliente);
    } else {
        console.log("Não há mais clientes para carregar.");
    }
}

function novoClienteModal(){
    const modal = document.getElementById("cadastroModal");
    modal.style.display = "flex";
}

function cancelarModalCliente(){
    const modal = document.getElementById("cadastroModal");
    modal.style.display = "none";
}

async function procurarCliente(value){
    let valueToURL = "0";
    if(value){
        valueToURL = value.replace(" ","_").toLowerCase();
    }
    let trabalhaEm = await getCookies5("trabalha_em");
    await fetch(`/populate/cliente/${trabalhaEm}/${valueToURL}`)
    .then(response => response.json())
    .then(data => {
        if(!value){
            const quantidadeMaxima = 11;
            if(data.length <= quantidadeMaxima){
                document.getElementById('buttonVerMais').style.display = 'none';
            } else {
                document.getElementById('buttonVerMais').style.display = 'flex';
            }
        } else {
            document.getElementById('buttonVerMais').style.display = 'none';
        }
        const ul = document.getElementById("clientes-list");
        ul.innerHTML = " "
        if(data[0]){
            data.forEach(cliente => {
                const li = document.createElement("li");
                li.innerHTML = `
                <a id="${cliente.id_paciente}" href="/paciente?id=${cliente.id_paciente}">
                    <div>
                        <p> ${cliente.nome} </p>
                        <p> ${cliente.cidade_de_atendimento} </p>
                    </div>
                </a>`;
                ul.appendChild(li);
            });
        } else {
            ul.innerHTML = "<p style='margin: 30px;'>Nenhum registro encontrado!</p>"
        }
    });
}