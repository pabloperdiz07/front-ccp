async function openVendidoModal(id){
    const carregamentoModalVendido = document.getElementById("carregamentoModalVendido");
    carregamentoModalVendido.style.display = "block";
    const detalhamentoVendido = document.getElementById("detalhamentoVendido");
    detalhamentoVendido.style.display = "none";
    const vendidoModal = document.getElementById("backgroundModalDetalhamentoVendido");
    vendidoModal.style.display = "flex";
    await preencherModalVendidoByID(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    carregamentoModalVendido.style.display = "none";
    detalhamentoVendido.style.display = "flex";
}

function closeModalVendido(){
    const vendidoModal = document.getElementById("backgroundModalDetalhamentoVendido");
    vendidoModal.style.display = "none";
    const carregamentoModalVendido = document.getElementById("carregamentoModalVendido");
    carregamentoModalVendido.style.display = "block";
    const detalhamentoVendido = document.getElementById("detalhamentoVendido");
    detalhamentoVendido.style.display = "none";

    document.getElementById("dataVendido").textContent = "";
    document.getElementById("pacienteVendido").textContent = "";
    document.getElementById("empresaVendido").textContent = "";
    
    document.getElementById("valorBrutoVendido").textContent = "0.00";
    document.getElementById("valorDescontoVendido").textContent = "0.00";
    document.getElementById("valorLiquidoVendido").textContent = "0.00";
    document.getElementById("totalPagoVendido").textContent = "0.00";

    document.getElementById("tbComprasVendido").innerHTML = ""
    document.getElementById("tbPagamentosVendido").innerHTML = ""
}

function openPagamentos(){
    const pagamentos = document.getElementById("pagamentosVendido");
    const compras = document.getElementById("comprasVendido");
    const pagamentosButton = document.getElementById("pagamentosButtonVendido");
    const comprasButton = document.getElementById("comprasButtonVendido");

    pagamentos.style.display = "block";
    compras.style.display = "none";
    pagamentosButton.style.backgroundColor = "#0D0D0D";
    pagamentosButton.style.color = "#C4C7B6";
    comprasButton.style.backgroundColor = "#C4C7B6";
    comprasButton.style.boxShadow = "none";
    comprasButton.style.color = "#1D361F";
}

function openCompras(){
    const pagamentos = document.getElementById("pagamentosVendido");
    const compras = document.getElementById("comprasVendido");
    const pagamentosButton = document.getElementById("pagamentosButtonVendido");
    const comprasButton = document.getElementById("comprasButtonVendido");

    compras.style.display = "block";
    comprasButton.style.backgroundColor = "#0D0D0D";
    comprasButton.style.color = "#C4C7B6";
    pagamentos.style.display = "none";
    pagamentosButton.style.backgroundColor = "#C4C7B6";
    pagamentosButton.style.boxShadow = "none";
    pagamentosButton.style.color = "#1D361F";
}

async function preencherModalVendidoByID(id){
    await fetch(`/populate/venda/${id}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("dataVendido").textContent = data[0][0].data_venda.split('T')[0];
        document.getElementById("pacienteVendido").textContent = data[0][0].nome;
        document.getElementById("empresaVendido").textContent = data[0][0].empresa;
        document.getElementById("valorLiquidoVendido").textContent = data[0][0].valor_venda;
        document.getElementById("cidadeVendido").textContent = data[0][0].venda_em;
        const tbPagamentosVendido = document.getElementById("tbPagamentosVendido");
        let totalPagoVendido = 0;
        data[1].forEach(pagamento => {
            tbPagamentosVendido.innerHTML += `
            <tr>
                <td>${pagamento.FORMA_PAGAMENTO}</td>
                <td>${pagamento.PARCELAMENTO}</td>
                <td>R$ ${pagamento.VALOR_PAGO}</td>
                <td>-</td>
            </tr>
            `;
            totalPagoVendido += Number(pagamento.VALOR_PAGO);
        });
        document.getElementById("totalPagoVendido").textContent = totalPagoVendido.toFixed(2);
       
        const tbComprasVendido = document.getElementById("tbComprasVendido");
        let totalBrutoVendido = 0;
        let totalDescontoVendido = 0;
        data[2].forEach(produto => {
            tbComprasVendido.innerHTML += `
            <tr>
                <td>${produto.descricao}</td>
                <td>${produto.quantidade_produto}</td>
                <td>R$ ${produto.valor_desconto}</td>
                <td>R$ ${produto.valor_pago}</td>
                <td>${produto.nome}</td>
            </tr>
            `;
            totalBrutoVendido += Number(produto.valor_pago);
            totalDescontoVendido += Number(produto.valor_desconto);
        });
        document.getElementById("valorBrutoVendido").textContent = totalBrutoVendido.toFixed(2);
        document.getElementById("valorDescontoVendido").textContent = totalDescontoVendido.toFixed(2);
    })
    .catch(error => console.error("Error fetching client names:", error));
}