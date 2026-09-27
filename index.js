// ==============================================================================
// 1. IMPORTAÇÃO DE MÓDULOS (PACOTES / BIBLIOTECAS)
// ==============================================================================
// No Node.js, usamos o comando "require" para chamar ferramentas prontas (módulos) 
// que instalamos via npm. A palavra "const" cria uma variável cujo valor não muda.

// O Express é o framework principal para criar servidores web, gerenciar rotas (URLs) e respostas.
const express = require("express");

// O express-handlebars é o motor de templates (permite misturar HTML com dados dinâmicos do JavaScript).
const handlebars = require("express-handlebars");

// O body-parser serve para capturar, ler e entender os dados enviados por formulários HTML (através do método POST).
const bodyParser = require("body-parser");

// O Mongoose conecta a aplicação ao MongoDB e define os modelos dos documentos.
const mongoose = require('mongoose');
const Postagem = require('./Mongoose');

// ==============================================================================
// 2. INICIALIZAÇÃO DO APLICATIVO
// ==============================================================================
// Aqui criamos uma cópia/instância do Express chamada "app". 
// A partir desta variável "app", vamos configurar e criar todo o nosso servidor.
const app = express();

// ==============================================================================
// 3. CONFIGURAÇÃO DO BANCO DE DADOS (MongoDB com Mongoose)
// ==============================================================================
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aula_allan';

// ==============================================================================
// 6. CONFIGURAÇÃO DO TEMPLATE ENGINE (HANDLEBARS)
// ==============================================================================
// Indicamos ao Express que o Handlebars será o responsável por desenhar nossas telas (páginas HTML).
// 'main' é o arquivo de modelo base (layout padrão localizado em views/layouts/main.handlebars).
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');

// ==============================================================================
// 7. CONFIGURAÇÃO DO BODY-PARSER (LEITOR DE DADOS DE FORMULÁRIO)
// ==============================================================================
// Essas duas linhas ativam o Body Parser para que os dados preenchidos pelo usuário
// no formulário possam ser acessados através de "req.body".
app.use(bodyParser.urlencoded({ extended: false })); // Permite ler dados codificados da URL (formulários comuns)
app.use(bodyParser.json());                         // Permite ler dados no formato JSON caso seja necessário

// ==============================================================================
// 8. ROTAS DA APLICAÇÃO (ONDE O USUÁRIO NAVEGA)
// ==============================================================================
// Uma rota é o endereço que você digita no navegador (ex: localhost:8081/).
// Cada função de rota recebe dois parâmetros fundamentais:
// - "req" (Requisição): informações que o usuário enviou (dados, parâmetros da URL, etc.)
// - "res" (Resposta): o que nosso servidor vai devolver para o usuário (página HTML, mensagem, etc.)

// ROTA 1: Página inicial (Lista todas as postagens cadastradas)
app.get("/", function (req, res) {
    Postagem.find().sort({ _id: -1 }).then(function (postagens) {
        const posts = postagens.map(function (postagem) {
            return postagem.toObject({ virtuals: true });
        });
        res.render("home", { posts: posts });
    }).catch(function (erro) {
        res.send("Erro ao buscar postagens: " + erro);
    });
});

// ROTA 2: Página do formulário de cadastro
app.get("/formulario", function (req, res) {
    res.render("formulario");
});

// ROTA 3: Rota para onde o formulário envia os dados (método POST: cria/salva dados)
app.post("/add", function (req, res) {
    Postagem.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }).then(function () {
        // Redireciona o usuário para a página inicial onde a postagem aparecerá
        res.redirect("/");
    }).catch(function (erro) {
        res.send("Erro ao criar postagem: " + erro);
    });
});

// ROTA 4: Exemplo de rota com parâmetros na URL
app.get("/ola/:cargo/:nome", function (req, res) {
    res.send(req.params);
});

// ROTA 5: Rota para excluir uma postagem pelo ID
app.get("/excluir/:id", function (req, res) {
    Postagem.deleteOne({ _id: req.params.id }).then(function () {
        res.redirect("/deletado");
    }).catch(function (erro) {
        res.send("Erro ao deletar postagem: " + erro);
    });
});

// ROTA 6: Confirmação de exclusão
app.get("/deletado", function (req, res) {
    res.render("excluir");
});

// ROTA 7: Abre o formulário de edição com os dados da postagem
app.get("/editar/:id", function (req, res) {
    Postagem.findById(req.params.id).then(function (postagem) {
        if (postagem) {
            res.render("editar", { post: postagem.toObject({ virtuals: true }) });
        } else {
            res.send("Esta postagem não foi encontrada!");
        }
    }).catch(function (erro) {
        res.send("Erro ao carregar postagem: " + erro);
    });
});

// ROTA 8: Salva as alterações feitas no formulário de edição
app.post("/update", function (req, res) {
    Postagem.findByIdAndUpdate(req.body.id, {
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }, { runValidators: true }).then(function () {
        res.redirect("/");
    }).catch(function (erro) {
        res.send("Erro ao atualizar postagem: " + erro);
    });
});

// ==============================================================================
// 9. LIGANDO O SERVIDOR
// ==============================================================================
// app.listen() faz o servidor começar a "ouvir" e responder na porta indicada (8081).
// Deve sempre ser uma das últimas linhas do arquivo.
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 }).then(function () {
    console.log("Conectado ao MongoDB!");
    app.listen(8081, function () {
        console.log("Servidor rodando na url http://localhost:8081");
    });
}).catch(function (erro) {
    console.error("Falha ao conectar ao MongoDB:", erro.message);
    process.exitCode = 1;
});
