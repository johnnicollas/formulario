const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Postagem = require('./Mongoose');

const app = express();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aula_allan';

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get("/formulario", function (req, res) {
    res.render("formulario");
});

app.post("/add", function (req, res) {
    Postagem.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }).then(function () {
        res.redirect("/");
    }).catch(function (erro) {
        res.send("Erro ao criar postagem: " + erro);
    });
});

app.get("/ola/:cargo/:nome", function (req, res) {
    res.send(req.params);
});

app.get("/excluir/:id", function (req, res) {
    Postagem.deleteOne({ _id: req.params.id }).then(function () {
        res.redirect("/deletado");
    }).catch(function (erro) {
        res.send("Erro ao deletar postagem: " + erro);
    });
});

app.get("/deletado", function (req, res) {
    res.render("excluir");
});

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

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 }).then(function () {
    console.log("Conectado ao MongoDB!");
    app.listen(8081, function () {
        console.log("Servidor rodando na url http://localhost:8081");
    });
}).catch(function (erro) {
    console.error("Falha ao conectar ao MongoDB:", erro.message);
    process.exitCode = 1;
});
