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
    if (req.body.produto && req.body.produto.trim().toUpperCase() === "GOL") { // verifica se o produto é "gol" (em maiúsculas/minúsculas e com espaços) e retorna um erro 404 //  
        return res.status(404).sendFile(path.join(__dirname, "public", "erro404.html"));
    }
    
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
    const produtoRemovido = mercado.splice(index, 1); // remove o produto do array de produtos //
    res.json({ message: "Produto removido com sucesso", produto: produtoRemovido[0] }); // envia uma resposta de sucesso com o produto removido //  
});

// O servidor localiza o produto pelo id e substitui os dados recebidos no body//
app.put("/mercado/:id", (req, res) => {
    const id = Number(req.params.id);
    const produto = mercado.find((produto) => produto.id === id);
    produto.produto = req.body.produto;
    produto.quantidade = req.body.quantidade;
    produto.preco = req.body.preco;
    res.json(produto);
});

