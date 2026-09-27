const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/nomeDoBancoDeDados').then(function () {
    console.log('Conectado com sucesso')
}).catch(function (erro) {
    console.log("Houve um erro ao se conectar ao MongoB: " + erro)
})

// Definição do Schema
const usuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    pais: {
        type: String
    }
})

// Registro do Model
mongoose.model("usuarios", usuarioSchema)

// Inserção de dados
let novoUsuario = mongoose.model("usuarios")

new novoUsuario({
    nome: "Allan",
    sobrenome: "Vilar",
    idade: 32,
    email: "allanvilarcarvalho@gmail.com",
    pais: "Brasil"
}).save().then(function () {
    console.log("Usuario inserido com sucesso!")
}).catch(function (erro) {
    console.log("Erro ao inserir um novo usuario: " + erro)
})

