document.addEventListener("DOMContentLoaded", async () => {
    await carregarProdutos();
    await povoarFormFields();
});

function carregarProdutos() {
    fetch("/populate/produtos")
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById("produtos-list");
            data.forEach(produto => {
                const li = document.createElement("li");
                li.innerHTML = `
                <a onclick="openModalEditProduto(${produto.id_produto})">
                    <div>
                        <p> ${produto.descricao} </p>
                        <p>R$ ${produto.valor} </p>
                    </div>
                </a>`;
                ul.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching client names:", error));
};

function povoarFormFields() {
    fetch("/populate/forms/cadastro/produtos")
        .then(response => response.json())
        .then(data => {
            const inputsCadastroProdutos = document.querySelector('#inputsSideForm')
            let typeOfColumn;
            data.forEach(column => {
                if(column.Field !== "ID_PRODUTO"){
                    typeOfColumn = column.Type;
                    if(typeOfColumn.includes('enum')){
                        inputsCadastroProdutos.innerHTML +=`
                        <label for="${column.Field}">${column.Field}</label>
                        <select class="selectForm dataForm" name="${column.Field}" id="${column.Field}">
                        </select>`
                        let itensLista = (typeOfColumn.match(/\(([^)]+)\)/)[1]).split(',');
                        itensLista.forEach(option => {
                            option = option.replace(/'/g, '');
                            const selectAtual = document.querySelector(`#${column.Field}`)
                            selectAtual.innerHTML +=`
                            <option value="${option}">${option}</option>`
                        })
                    } else {
                        inputsCadastroProdutos.innerHTML +=`
                        <label for="${column.Field}">${column.Field}</label>
                        <input class="inputForm dataForm" name="${column.Field}" id="${column.Field}">
                        `
                    }
                } else {
                    inputsCadastroProdutos.innerHTML +=`
                        <label style="display:none;" for="${column.Field}">${column.Field}</label>
                        <input style="display:none;" class="inputForm dataForm" disabled name="${column.Field}" id="${column.Field}">
                        `
                }
            })
        })
        .catch(error => console.error("Error fetching client names:", error));
};

function openModalProduto(){
    const modal = document.getElementById("produtosModal");
    modal.style.display = "flex";
}

function cancelarModalProdutos(){
    const modal = document.getElementById("produtosModal");
    modal.style.display = "none";
    const selectForm = document.querySelectorAll(".selectForm");
    const inputForm = document.querySelectorAll(".inputForm");
    selectForm.forEach(select => select.selectedIndex = 0)
    inputForm.forEach(input => input.value = "")
    const buttonSubmitForm = document.getElementById("buttonSubmitForm");
    buttonSubmitForm.onclick = novoProduto;
}

function openModalEditProduto(id) {
    fetch(`/populate/produto/${id}`)
        .then(response => response.json())
        .then(data => {
            const buttonSubmitForm = document.getElementById("buttonSubmitForm");
            Object.keys(data[0]).forEach(key => {
                const idKey = document.getElementById(key);
                idKey.value = data[0][key];
                if(key === "ID_PRODUTO"){
                    buttonSubmitForm.onclick = function() {
                        atualizarProduto(data[0][key]);
                    };
                }
            })
            openSideFormModal();
        })
        .catch(error => console.log("Erro ao tentar pegar as informações do produto: ", error));
}

async function atualizarProduto(produtoId) {
    const inputs = document.querySelectorAll('.dataForm');
    const jsonData = {};
    inputs.forEach(input => {
        jsonData[input.name] = input.value;
    });
    const jsonString = JSON.stringify(jsonData);
    try {
        const response = await fetch(`/api/update/produto/${produtoId}`, {
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
            console.error('Erro ao atualizar produto:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
    }
};

async function novoProduto(){
    const inputs = document.querySelectorAll('.dataForm');
    const jsonData = {};
    inputs.forEach(input => {
        if(input.name !== "ID_PRODUTO"){
            jsonData[input.name] = input.value;
        }
    });
    const jsonString = JSON.stringify(jsonData);
    try {
        const response = await fetch(`/api/cadastro/produto`, {
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
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
    }
}