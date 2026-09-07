const express = require ("express"); //trazer o arquivo de express //
const app = express(); //cria a aplicação express //
const path = require("path"); //trazer o arquivo de path, atualizações //
app.use(express.json()); 
app.use(express.static("public"));

// cria uma rota GET para o endereço raiz ("/") do servidor, que envia o arquivo index.html localizado na pasta "public" como resposta. //
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(5000, () => { //criar porta de escuta //
    console.log("Servidor rodando na porta 5000");
});

//criar array vazio para armazenar os produtos cadastrados //
let mercado = []; 

//criar rota para listar os produtos cadastrados //
app.get("/mercado", (req, res) => { 
    res.json(mercado);
});

// criar rota para cadastrar novos produtos //
app.post("/mercado", (req, res) => {
    const novoProduto = {
        id:Date.now(),
        produto: req.body.produto,
        quantidade: Number(req.body.quantidade),
        preco: Number(req.body.preco),
    };
    mercado.push(novoProduto); // adiciona o novo produto ao array de produtos //
    res.status(201).json(novoProduto); // envia uma resposta de sucesso com o novo produto cadastrado //              
});
app.delete("/mercado/:id", (req, res) => {
    const produtoId = parseInt(req.params.id); // obtém o ID do produto a ser removido a partir dos parâmetros da rota //
    const index = mercado.findIndex((produto) => produto.id === produtoId); // encontra o índice do produto no array de produtos //

    if (index === -1) { // verifica se o produto foi encontrado //
        return res.status(404).json({ message: "Produto não encontrado" }); // envia uma resposta de erro caso o produto não seja encontrado //
    }   // envia uma resposta de erro caso o produto não seja encontrado //
    
    const produtoRemovido = mercado.splice(index, 1); // remove o produto do array de produtos //
    res.json({ message: "Produto removido com sucesso", produto: produtoRemovido[0] }); // envia uma resposta de sucesso com o produto removido //  
});

// O servidor localiza o produto pelo id e substitui os dados recebidos no body//
app.put("/mercado/:id", (req, res) => {
    const id = Number(req.params.id);
    const produto = mercado.find((produto) => produto.id === id);
    if (!produto) {
        return res.status(404).json({
            mensagem: "Produto não encontrado."
        });
    }
    produto.produto = req.body.produto;
    produto.quantidade = req.body.quantidade;
    produto.preco = req.body.preco;
    res.json(produto);
});

