document.addEventListener('DOMContentLoaded', async function() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get('id');
    await getClienteById(id);
    await getSalesByClientId(id);
});

async function getClienteById(id) {
    await fetch(`/populate/paciente/${id}`)
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById("paciente-info");
            const div = document.createElement("div");
            let inputAtual;
            ul.appendChild(div);
            Object.keys(data[0]).forEach(key => {
                if(key !== 'ID_PACIENTE') {
                    if(key === 'NOME'){
                        document.querySelector(".paciente").value = data[0][key];
                    }
                    if(key === 'OBSERVACAO'){
                        document.getElementById("observacao").textContent = data[0][key];
                        inputAtual = document.getElementById(key);
                        inputAtual.value = data[0][key];
                        inputAtual.classList.add('inputFormUpdateCliente');
                    } else {
                        div.innerHTML += `
                        <div>
                            <p><strong>${capitalizarTexto(key)} : </strong>${data[0][key] == null ? "" : data[0][key]}</p>
                        </div>`
                        inputAtual = document.getElementById(key);
                        inputAtual.value = data[0][key];
                        inputAtual.classList.add('inputFormUpdateCliente');
                    }
                } else {
                    document.querySelector(".paciente").id = data[0][key];
                }
            });
        })
        .catch(error => console.error("Error fetching client names:", error));
}

async function getSalesByClientId(id) {
    await fetch(`/populate/paciente/vendas/${id}`)
    .then(response => response.json())
    .then(data => {
        const vendasPaciente = document.getElementById('vendasPaciente');
        data.forEach(venda => {
            let html = `
                <a onclick="openVendidoModal(${venda.ID_VENDA})">
                    <li style="background-color: ${venda.EMPRESA === 'CPO'? "blue" : "red"}">
                        <div>
                        </div>
                        <div>
                            <p>R$ ${venda.VALOR_VENDA}</p>
                            <p>${venda.DATA_VENDA.split('T')[0]}</p>
                        </div>
                    </li>
                </a>
            `;
            vendasPaciente.innerHTML += html
        });
    });
}

function openModalPacienteById(){
    const modal = document.getElementById("modalUpdatePaciente");
    modal.style.display = "flex";
}

function cancelarModalPacientePorId(){
    const modal = document.getElementById("modalUpdatePaciente");
    modal.style.display = "none";
}

async function deletePacienteById() {
    const params = new URLSearchParams(window.location.search);
    const pacienteId = params.get('id');
    try {
        await fetch(`/api/delete/cliente/${pacienteId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
    }
    window.location.href = "/";
}


async function atualizarCliente() {
    const params = new URLSearchParams(window.location.search);
    const pacienteId = params.get('id');
    const inputs = document.querySelectorAll('.inputFormUpdateCliente');
    const jsonData = {};
    inputs.forEach(input => {
        jsonData[input.name] = input.value;
    });
    const jsonString = JSON.stringify(jsonData);
    try {
        const response = await fetch(`/api/update/cliente/${pacienteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
            },
            body: jsonString
        });
        if (response.ok) {
            // Redirecionar após a atualização
            location.reload();
        } else {
            console.error('Erro ao atualizar cliente:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
    }
};

function capitalizarTexto(texto) {
    // Dividir o texto em palavras separadas por "_"
    var palavras = texto.split('_');

    // Capitalizar a primeira letra de cada palavra e converter o restante para minúsculo
    for (var i = 0; i < palavras.length; i++) {
        palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1).toLowerCase();
    }

    // Juntar as palavras com espaço
    var textoTransformado = palavras.join(' ');

    return textoTransformado;
}