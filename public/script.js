const form = document.getElementById("formulario");
form.addEventListener ("submit", async(event) => {
    event.preventDefault(); // impede o envio padrão do formulário //
    const produto = document.getElementById("produto").value;
    const quantidade = parseFloat(document.getElementById("qtd").value);
    const preco = parseFloat(document.getElementById("preco").value.replace(",", ".")); 
    const resposta = await fetch("/mercado", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({produto: produto, quantidade: quantidade, preco: preco }),
    });

const produtos = await resposta.json();

console.log(produtos);
form.reset(); // limpa os campos do formulário //
carregarProdutos(); // atualiza a lista de produtos cadastrados //
});

async function carregarProdutos() {
    const resposta = await fetch("/mercado");
    const produtos = await resposta.json();

    const listaProdutos = document.getElementById("listaProdutos");
    listaProdutos.innerHTML = ""; // limpa a lista antes de adicionar os produtos //

    produtos.forEach((produto) => {
        const item = document.createElement("p");
            item.innerHTML = `
            ${produto.produto} - ${produto.quantidade} x ${produto.preco} = ${ (produto.quantidade * produto.preco).toFixed(2) }
            <button onclick="excluirProduto(${produto.id})">
            <img src="./assets/circulo-xmark.svg" class="imgform" alt=""> Excluir
            </button>
        `;                                  
        listaProdutos.appendChild(item);
    });
};

// NOVA FUNÇÃO: soma o subtotal de todos os produtos //
async function calcularTotal() {
    const resposta = await fetch("/mercado");
    const produtos = await resposta.json();

    const total = produtos.reduce((soma, produto) => {// o reduce percorre o array de produtos e acumula o valor total //
        return soma + produto.quantidade * produto.preco;
    }, 0); // o 0 é o valor inicial da soma //

   document.getElementById("total").innerHTML = `<img src="./assets/cesta-de-compras.svg" class="imgform" alt=""> Total: R$ ${total.toFixed(2)}`;
}

carregarProdutos(); // carrega a lista de produtos cadastrados ao carregar a página //

async function excluirProduto(id) {
    const resposta = await fetch(`/mercado/${id}`, {
        method: "DELETE"
    });
    const resultado = await resposta.json();
    console.log(resultado);
    carregarProdutos();
};

