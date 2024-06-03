document.addEventListener('DOMContentLoaded', async () => {
    await carregarVendedores();
    await carregarProdutos();
    let cidades = await getCookies2("trabalha_em").split(".");
    //retirando o 'display: none' definido inline no HTML 
    cidades.forEach(cidade => document.getElementById(cidade).style.display = 'block');
});

function getCookies2(cookie){
    const listaCookies = document.cookie.split(';');
    for( i = 0 ; i < listaCookies.length ; i++ ){
        const cookiePair = listaCookies[i].trim();
        if (cookiePair.startsWith(cookie + '=')) {
            return cookiePair.split('=')[1];
        }
    }
}

function carregarVendedores(){
    const select = document.getElementById("vendedor");
    fetch(`/populate/vendedores`)
    .then(response => response.json())
    .then(data => {
        data.forEach(vendedor => {
            select.innerHTML += `
            <option id="${vendedor.id_vendedor}" value="${vendedor.nome}">${vendedor.nome}</option>
            `;
        });
    })
    .catch(error => console.error("Erro ao tentar pegar as informações do vendedor: ", error));
}

function carregarProdutos(){
    const select = document.getElementById("produto");
    fetch(`/populate/produtos`)
    .then(response => response.json())
    .then(data => {
        data.forEach(produto => {
            select.innerHTML += `
            <option style=${produto.empresa === 'WAL' ? "display:none;" : "display:flex;"} id="${produto.id_produto}" class="${produto.empresa}" value="${produto.valor}">${produto.descricao}</option>
            `;
        });
    })
    .catch(error => console.error("Erro ao tentar pegar as informações do produto: ", error));
}

// onclick :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function openVendaProdutoModal(){
    const vendasModal = document.getElementById("vendasModalBox");
    vendasModal.style.display = "block";
    document.body.classList.add('modal-open');
}

function closeVendaProdutoModal(){
    const vendasModal = document.getElementById("vendasModalBox");
    vendasModal.style.display = "none";

    //resetando todas as variaveis necessarias
    document.getElementById("dataVenda").value = "";
    document.getElementById("quantidade").value = 1;
    document.getElementById("desconto").value = 0;
    document.getElementById("valorParcial").textContent = 0;
    document.getElementById("valorPago").value = 0;
    document.getElementById("produto").selectedIndex = 0;
    document.getElementById("vendedor").selectedIndex = 0;
    document.getElementById("formaPagamento").selectedIndex = 0;
    document.getElementById("parcelamento").selectedIndex = 0;
    document.getElementById("valorBruto").textContent = "0.00";
    document.getElementById("valorDesconto").textContent = "0.00";
    document.getElementById("valorLiquido").textContent = "0.00";
    document.getElementById("totalPago").textContent = "0.00";
    document.querySelector("#shoppingCart > table > tbody").innerHTML = "";
    document.querySelector("#pagamentos > table > tbody").innerHTML = "";
    const buttonVenda = document.getElementById("enviarVenda");
    buttonVenda.disabled = true;
    buttonVenda.style.backgroundColor = "var(--primary-light)";
    buttonVenda.style.color = "var(--primary-dark)";
    document.getElementById("empresa").disabled = false;
    document.body.classList.remove('modal-open');
}

//posso melhoras as duas próximas funções transformando-as em apenas uma

function openVendasForm(){
    const vendasForm = document.querySelectorAll(".sales");
    const pagamentosForm = document.querySelectorAll(".pagamentos");
    const buttonVendas = document.getElementById("buttonVendas");
    const buttonPagamentos = document.getElementById("buttonPagamentos");
    pagamentosForm.forEach(item => {
        item.style.display = "none";
    })
    vendasForm[0].style.display = "flex";
    vendasForm[1].style.display = "block";
    buttonVendas.style.backgroundColor = "var(--primary-light)";
    buttonVendas.style.color = "var(--primary-dark)";
    buttonPagamentos.style.backgroundColor = "var(--primary-dark)";
    buttonPagamentos.style.color = "var(--primary-light)";
}

function openPagamentosForm(){
    const vendasForm = document.querySelectorAll(".sales");
    const pagamentosForm = document.querySelectorAll(".pagamentos");
    const buttonVendas = document.getElementById("buttonVendas");
    const buttonPagamentos = document.getElementById("buttonPagamentos");
    vendasForm.forEach(item => {
        item.style.display = "none";
    })
    pagamentosForm[0].style.display = "flex";
    pagamentosForm[1].style.display = "block";
    buttonPagamentos.style.backgroundColor = "var(--primary-light)";
    buttonPagamentos.style.color = "var(--primary-dark)";
    buttonVendas.style.backgroundColor = "var(--primary-dark)";
    buttonVendas.style.color = "var(--primary-light)";
}

// fim da segunda função que pode ser melhorada;

function calcularTotalProduto() {
    const produto = document.getElementById("produto").value;
    const quantidade = document.getElementById("quantidade").value;
    const desconto = document.getElementById("desconto").value;
    const valorParcial = document.getElementById("valorParcial");
    if (produto > 0) {
        let totalParcial = produto;
        if (quantidade > 0) {
            totalParcial *= quantidade;
        }
        valorParcial.textContent = (totalParcial - desconto).toFixed(2);
    }
}

function lancarCarrinho() {
    // Desativando mudança de empresa
    document.getElementById("empresa").disabled = true;

    // Definindo as informações da venda
    const produto = document.getElementById("produto");
    const produtoSelecionado = produto.options[produto.selectedIndex];
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const desconto = parseFloat(document.getElementById("desconto").value);
    const valorParcial = parseFloat(document.getElementById("valorParcial").textContent);
    const vendedor = document.getElementById("vendedor");
    const vendedorSelecionado = vendedor.options[vendedor.selectedIndex];

    // Atualizando o carrinho
    if(produto.value === "0" || valorParcial < 0 || quantidade < 1 ) {
        alert("Algo está errado, reveja as informações antes do lançamento.")
    } else {
        // Declarando variáveis totais
        let novoValorBruto;
        let novoValorDesconto;
        let novoValorLiquido;

        // Condição: se o produto já existe na tabela
        if(document.getElementById(`btn${produtoSelecionado.id}`)){
            //pegando os valores de linha antigo
            const quantidadeLinhaAntiga = document.getElementById(`qnt${produtoSelecionado.id}`)
            const descontoLinhaAntiga = document.getElementById(`descontobtn${produtoSelecionado.id}`)
            const valorLinhaAntiga = document.getElementById(`valorbtn${produtoSelecionado.id}`)
            const buttonDel = document.getElementById(`btn${produtoSelecionado.id}`);
            
            //operando os valores
            const quantidadeLinhaNova = parseInt(quantidadeLinhaAntiga.textContent) + quantidade;
            const descontoLinhaNova = parseFloat(descontoLinhaAntiga.textContent) + desconto;
            const valorLinhaNova = parseFloat(valorLinhaAntiga.textContent) + valorParcial;
            const valorButton = (valorParcial * quantidade) + parseFloat(buttonDel.value);

            // Aplicando variáveis modificadas
            quantidadeLinhaAntiga.textContent = quantidadeLinhaNova;
            descontoLinhaAntiga.textContent = descontoLinhaNova;
            valorLinhaAntiga.textContent = valorLinhaNova;
            buttonDel.value = valorButton;

            // Atualizando os valores gerais
            let valorBruto = parseFloat(document.getElementById("valorBruto").textContent);
            let valorDesconto = parseFloat(document.getElementById("valorDesconto").textContent);
            let valorLiquido = parseFloat(document.getElementById("valorLiquido").textContent);
            novoValorBruto = valorBruto + valorParcial + desconto;
            novoValorDesconto = valorDesconto + desconto;
            novoValorLiquido = valorLiquido + valorParcial;
        } else {
            const carrinho = document.querySelector("#shoppingCart > table > tbody");
            const venda = `
            <tr>
                <td style="display:none;">${produtoSelecionado.id}</td>
                <td>${produtoSelecionado.text}</td>
                <td id="qnt${produtoSelecionado.id}">${quantidade}</td>
                <td id="descontobtn${produtoSelecionado.id}">${desconto.toFixed(2)}</td>
                <td id="valorbtn${produtoSelecionado.id}">${valorParcial.toFixed(2)}</td>
                <td>${vendedorSelecionado.value}</td>
                <td style="display:none;">${vendedorSelecionado.id}</td>
                <td><a id="btn${produtoSelecionado.id}" value="${valorParcial.toFixed(2)}" onclick="deletarItem(id,value)"><img class="deleteIcon" src="../../../assets/images/delete.svg"></a></td>
            </tr>`;
            carrinho.innerHTML += venda;
        
            // Atualizando os valores gerais
            let valorBruto = parseFloat(document.getElementById("valorBruto").textContent);
            let valorDesconto = parseFloat(document.getElementById("valorDesconto").textContent);
            let valorLiquido = parseFloat(document.getElementById("valorLiquido").textContent);
            novoValorBruto = valorBruto + valorParcial + desconto;
            novoValorDesconto = valorDesconto + desconto;
            novoValorLiquido = valorLiquido + valorParcial;
        }

        //aplicando variáveis modificadas aos totais
        document.getElementById("valorBruto").textContent = novoValorBruto.toFixed(2);
        document.getElementById("valorDesconto").textContent = novoValorDesconto.toFixed(2);
        document.getElementById("valorLiquido").textContent = novoValorLiquido.toFixed(2);
    
        // Resetando os valores
        produto.selectedIndex = 0;
        document.getElementById("quantidade").value = 1;
        document.getElementById("desconto").value = 0;
        document.getElementById("valorParcial").textContent = 0;
        vendedor.selectedIndex = 0;

        //ativando botao de enviar
        if (parseFloat(document.getElementById("totalPago").textContent).toFixed(2) === novoValorLiquido.toFixed(2)) {
            const buttonEnviar = document.getElementById("enviarVenda");
            buttonEnviar.disabled = false;
            buttonEnviar.style.backgroundColor = "var(--primary-dark)";
            buttonEnviar.style.color = "var(--primary-light)";
        }
    }
    //verificando botao de enviar
    verificarBotaoEnviarVenda();
}

function lancarPagamento() {
    
    // Definindo as informações do pagamento
    const formaPagamento = document.getElementById("formaPagamento");
    const formaSelecionada = formaPagamento.options[formaPagamento.selectedIndex];
    const parcelamento = document.getElementById("parcelamento");
    const parcelamentoSelecionado = parcelamento.options[parcelamento.selectedIndex];
    const valorPago = parseFloat(document.getElementById("valorPago").value);
    if(formaPagamento.value != 0 && parcelamento.value != 0 && valorPago > 0){
        //definindo valores gerais
        let totalPago = parseFloat(document.getElementById("totalPago").textContent);
        let novoValorPago = valorPago + totalPago;
        let valorLiquido = parseFloat(document.getElementById("valorLiquido").textContent);
        if (novoValorPago > valorLiquido) {
            alert("O valor pago não pode ser maior do que o devido.");
        } else {
            //lancando pagamento na tabela pagamentos
            const pagamentos = document.querySelector("#pagamentos > table > tbody");
            const pagamento = `
            <tr>
            <td>${formaSelecionada.text}</td>
            <td>${parcelamentoSelecionado.text}</td>
            <td>${valorPago.toFixed(2)}</td>
            <td>-</td>
            <td><a id="${formaSelecionada.text}${parcelamentoSelecionado.text}${valorPago}" value="${valorPago.toFixed(2)}" onclick="deletarPagamento(id,value)"><img class="deleteIcon" src="../../../assets/images/delete.svg"></a></td>
            </tr>`;
            pagamentos.innerHTML += pagamento;
            
            // Atualizando os valores gerais
            document.getElementById("totalPago").textContent = novoValorPago.toFixed(2);
            
            //resetando os valores
            formaPagamento.selectedIndex = 0;
            parcelamento.selectedIndex = 0;
            document.getElementById("valorPago").value = 0;
        }
        //ativando botao de enviar
        verificarBotaoEnviarVenda();
    } else {
        alert("Está faltando preencher alguma informação importante para o pagamento!");
    };
}

function empresaEscolhida() {
    const empresa = document.getElementById("empresa").value;
    const wal = document.querySelectorAll(".WAL");
    const cpo = document.querySelectorAll(".CPO");
    if (empresa === "WAL") {
        wal.forEach(walItem => walItem.style.display = "block");
        cpo.forEach(cpoItem => cpoItem.style.display = "none");
    } else {
        cpo.forEach(cpoItem => cpoItem.style.display = "block");
        wal.forEach(walItem => walItem.style.display = "none");
    }
}

function deletarItem(id, value) {
    // Definindo as variáveis para condicional
    const valor = parseFloat(value);
    const valorLiquidoElement = document.getElementById("valorLiquido");
    const valorLiquido = parseFloat(valorLiquidoElement.textContent);
    const novoValorLiquido = valorLiquido - valor;

    if (parseFloat(document.getElementById("totalPago").textContent) > novoValorLiquido){
        alert("Impossibilidade: o valor líquido será menor que o valor pago.");
    } else {
        // Definindo as outras variáveis relevantes
        const valorBrutoElement = document.getElementById("valorBruto");
        const valorDescontoElement = document.getElementById("valorDesconto");
        const desconto = parseFloat(document.getElementById(`desconto${id}`).textContent);
    
        // Convertendo o conteúdo dos elementos em números
        const valorBruto = parseFloat(valorBrutoElement.textContent);
        const valorDesconto = parseFloat(valorDescontoElement.textContent);
        
        // Operando as variáveis
        const novoValorBruto = valorBruto - valor - desconto;
        const novoValorDesconto = valorDesconto - desconto;
    
        // Atualizando o conteúdo dos elementos na página
        valorBrutoElement.textContent = novoValorBruto.toFixed(2);
        valorDescontoElement.textContent = novoValorDesconto.toFixed(2);
        valorLiquidoElement.textContent = novoValorLiquido.toFixed(2);
    
        // Excluindo a linha em questão
        const buttonDel = document.getElementById(id);
        const row = buttonDel.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
    //verificando botao de enviar
    verificarBotaoEnviarVenda();
}

function deletarPagamento(id, value) {
    // Operando as variáveis
    const totalPagoElement = document.getElementById("totalPago");
    const totalPago = parseFloat(totalPagoElement.textContent);
    const novoTotalPago = totalPago - parseFloat(value);

    // Atualizando o conteúdo dos elementos na página
    totalPagoElement.textContent = novoTotalPago.toFixed(2);

    // Excluindo a linha em questão
    const buttonDel = document.getElementById(id);
    const row = buttonDel.parentNode.parentNode;
    row.parentNode.removeChild(row);

    //verificando botao de enviar
    verificarBotaoEnviarVenda();
}

function verificarBotaoEnviarVenda() {
    if (parseFloat(document.getElementById("valorLiquido").textContent) === parseFloat(document.getElementById("totalPago").textContent)) {
        const buttonEnviar = document.getElementById("enviarVenda");
        buttonEnviar.disabled = false;
        buttonEnviar.style.backgroundColor = "var(--primary-dark)";
        buttonEnviar.style.color = "var(--primary-light)";
    } else {
        const buttonEnviar = document.getElementById("enviarVenda");
        buttonEnviar.disabled = true;
        buttonEnviar.style.backgroundColor = "var(--primary-light)";
        buttonEnviar.style.color = "var(--primary-dark)";
    }
}


async function enviarVenda () {
    if(document.getElementById("dataVenda").value){
        // Preparando ambiente vendas
        const dataVendaStr = document.getElementById("dataVenda").value;
        const partesData = dataVendaStr.split("-"); // Dividir a string em partes (ano, mês, dia)
        const dataVenda = new Date(partesData[0], partesData[1] - 1, partesData[2]); // Mês é base 0, então subtraia 1
        const dataAtual = new Date();
        if (dataVenda > dataAtual) {
            alert("A data não pode ser maior do que a atual")
        } else {
            const empresa = document.getElementById("empresa").value;
            const valorVenda = document.getElementById("valorLiquido").textContent;
            const id_paciente = document.querySelector(".paciente").id;
            const vendaEm = document.getElementById("vendidoEm").value;
            const generalInfoList = [dataVenda, empresa, valorVenda, vendaEm, id_paciente];
            
            const id_venda = await cadastrarVenda(generalInfoList);
    
            // Preparando lançamento item
            const itensVendidos = document.querySelectorAll("#shoppingCart > table > tbody > tr");
            const valorBruto = document.getElementById('valorBruto');
            const valorBrutoConteudo = valorBruto.textContent;
            const listaItens = [];
            itensVendidos.forEach(item => {
                let listaItem = [id_venda, valorBrutoConteudo];
                let valoresItens = item.querySelectorAll("td");
                for(i=0 ; i < valoresItens.length - 1; i++){
                    listaItem.push(valoresItens[i].textContent);
                }
                listaItens.push(listaItem);
            });
            await cadastrarItens(listaItens);

            
            // Preparando lançamento pagamento
            const pagamentos = document.querySelectorAll("#pagamentos > table > tbody > tr");
            const listaPagamentos = [];
            pagamentos.forEach(pagamento => {
                let listaPagamento = [id_venda];
                let valoresPagamentos = pagamento.querySelectorAll("td");
                for(i=0 ; i < valoresPagamentos.length - 2; i++){
                    listaPagamento.push(valoresPagamentos[i].textContent);
                }
                listaPagamentos.push(listaPagamento);
            });
            await cadastrarPagamento(listaPagamentos);
            location.reload();
        }
    } else {
        alert("A data da venda não pode estar vazia!");
    }
}

// Lançar venda:
async function cadastrarVenda(generalInfoList) {
    const jsonData = {generalInfoList};
    const jsonString = JSON.stringify(jsonData);
    try {
        const response = await fetch("/api/cadastro/venda", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
            },
            body: jsonString
        });
        if (response.ok) {
            const data = await response.json();
            return data[0].ID_VENDA;
        } else {
            throw new Error('Erro ao lançar venda: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro ao lançar cliente: 2 ', error);
    }
};

// Lançar itens:
async function cadastrarItens(listaItens) {
    const jsonData = {listaItens};
    const jsonString = JSON.stringify(jsonData);
    try {
        await fetch("/api/cadastro/itens", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
            },
            body: jsonString
        });
    } catch (error) {
        console.error('Erro ao lançar itens: 2 ', error);
    }
};

// Lançar pagamento:
async function cadastrarPagamento(listaPagamentos) {
    const jsonData = {listaPagamentos};
    const jsonString = JSON.stringify(jsonData);
    try {
        await fetch("/api/cadastro/pagamento", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
            },
            body: jsonString
        });
    } catch (error) {
        console.error('Erro ao lançar pagamento: 2 ', error);
    }
};