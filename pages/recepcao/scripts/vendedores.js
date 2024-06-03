document.addEventListener("DOMContentLoaded", () => {
    fetch("/populate/vendedores")
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById("vendedores-list");
            data.forEach(vendedor => {
                const li = document.createElement("li");
                li.innerHTML = `
                <a onclick="openModalEditVendedor(${vendedor.id_vendedor})"  disabled="${vendedor.is_ativo}">
                    <div>
                        <p> ${vendedor.nome} </p>
                        <p> ${vendedor.setor} </p>
                    </div>
                </a>`;
                ul.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching vendedores:", error));
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("/populate/forms/cadastro/vendedor")
        .then(response => response.json())
        .then(data => {
            const inputsCadastrovendedor = document.querySelector('#inputsSideForm')
            let typeOfColumn;
            data.forEach(column => {
                typeOfColumn = column.Type;
                if(column.Field !== "ID_VENDEDOR" && column.Field !== "IS_ATIVO"){
                    if(typeOfColumn.includes('enum')){
                        inputsCadastrovendedor.innerHTML +=`
                        <label for="${column.Field}">${column.Field}</label>
                        <select class="selectForm dataForm" name="${column.Field}" id="${column.Field}">
                        </select>`;
                        let itensLista = (typeOfColumn.match(/\(([^)]+)\)/)[1]).split(',');
                        itensLista.forEach(option => {
                            option = option.replace(/'/g, '');
                            const selectAtual = document.querySelector(`#${column.Field}`)
                            selectAtual.innerHTML +=`
                            <option value="${option}">${option}</option>`;
                        })
                    } else {
                        inputsCadastrovendedor.innerHTML +=`
                        <label for="${column.Field}">${column.Field}</label>
                        <input class="inputForm dataForm" name="${column.Field}" id="${column.Field}">
                        `
                    }
                } else {
                    inputsCadastrovendedor.innerHTML +=`
                    <label style="display:none;" for="${column.Field}">${column.Field}</label>
                    <input class="inputForm dataForm" disabled style="display:none;" name="${column.Field}" id="${column.Field}">
                    `;
                }
            })
        })
        .catch(error => console.error("Error fetching vendedor:", error));
});

function openModalEditVendedor(id) {
    fetch(`/populate/vendedor/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            Object.keys(data[0]).forEach(key => {
                const idKey = document.getElementById(key);
                let lista = data[0][key].data;
                lista ? idKey.value = lista[0]: idKey.value = data[0][key];
                if(key === "ID_VENDEDOR"){
                    buttonSubmitForm.onclick = function() {
                        atualizarVendedor(data[0][key]);
                    };
                }
            });
            openSideFormModal();
            document.body.classList.add('modal-open');
        })
        .catch(error => console("Erro ao tentar pegar as informações do vendedor: ", error));
}

async function atualizarVendedor(vendedorId) {
    const inputs = document.querySelectorAll('.dataForm');
    const jsonData = {};
    inputs.forEach(input => {
        jsonData[input.name] = input.value;
    });
    const jsonString = JSON.stringify(jsonData);
    try {
        const response = await fetch(`/api/update/vendedor/${vendedorId}`, {
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
            console.error('Erro ao atualizar vendedor:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao atualizar vendedor:', error);
    }
};

async function novoVendedor(){
    const inputs = document.querySelectorAll('.dataForm');
    const jsonData = {};
    inputs.forEach(input => {
        if(input.name !== "ID_VENDEDOR" && input.name !== "IS_ATIVO"){
            jsonData[input.name] = input.value;
        }
    });
    const jsonString = JSON.stringify(jsonData);
    console.log(jsonString)
    try {
        const response = await fetch(`/api/cadastro/vendedor`, {
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
            console.error('Erro ao atualizar vendedor:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao atualizar vendedor:', error);
    }
}