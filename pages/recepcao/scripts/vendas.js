document.addEventListener("DOMContentLoaded", async () => {
    const trabalhaEm = await getCookies3("trabalha_em");
    await popularVendas(trabalhaEm);
});


function getCookies3(cookie){
    const listaCookies = document.cookie.split(';');
    for( i = 0 ; i < listaCookies.length ; i++ ){
        const cookiePair = listaCookies[i].trim();
        if (cookiePair.startsWith(cookie + '=')) {
            return cookiePair.split('=')[1];
        }
    }
}

async function popularVendas(trabalhaEm, dataInicial = "0", ultimoIdVenda = "0") {
    const ul = document.getElementById("listaVendas");
    try {
        const response = await fetch(`/populate/vendas/${trabalhaEm}/${dataInicial}/${ultimoIdVenda}`);
        const data = await response.json();
        const quantidadeMaxima = 8;
        const quantidadeRecebida = data.length;
        if (quantidadeRecebida === 0){
            document.getElementById("listaVendas").innerHTML = "<p style='margin: 10px;'>Nenhuma venda registrada após o período indicado!</p>";
        }
        if(quantidadeRecebida <= quantidadeMaxima){
            document.getElementById('buttonVerMais').style.display = 'none';
        } else {
            document.getElementById('buttonVerMais').style.display = 'flex';
        }
        for( i = 0 ; i < (quantidadeRecebida <= quantidadeMaxima ? quantidadeRecebida : quantidadeMaxima); i++ ){
            let venda = data[i];
            ul.innerHTML += `
            <a id="${i + Number(ultimoIdVenda) + 1}" onclick="openVendidoModal(${venda.id_venda})">
                <li style="background-color: ${venda.empresa === 'CPO' ? 'blue' : 'red'}">
                    <div></div>
                    <div>
                        <div>
                            <p>${venda.nome}</p>
                            <p class="secundaryP">${venda.data_venda.split('T')[0]}</p>
                        </div>
                        <div>
                            <p>R$ ${venda.valor_pago ? venda.valor_pago : "0.00"}</p> 
                            <p class="secundaryP">${venda.forma_pagamento ? venda.forma_pagamento : "Cortesia"}</p>
                        </div>
                    </div>
                </li>
            </a>
        `;
        }
    } catch (error) {
        console.log("Erro ao tentar pegar as informações da venda: ", error);
    }
}

async function dataInicialMudou(dataInicial) {
    document.getElementById("listaVendas").innerHTML = "";
    const trabalhaEm = await getCookies3("trabalha_em");
    await popularVendas(trabalhaEm, dataInicial);
}

async function verMaisVendas() {
    const ultimoIdVendaElement = document.querySelector("#listaVendas > a:last-child");
    if (ultimoIdVendaElement) {
        const ultimoIdVenda = ultimoIdVendaElement.id;
        const dataInicial = document.getElementById("dataInicial").value || "0";
        const trabalhaEm = await getCookies3("trabalha_em");
        await popularVendas(trabalhaEm, dataInicial, ultimoIdVenda);
    } else {
        console.log("Não há mais vendas para carregar.");
    }
}
