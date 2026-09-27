const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/nomeDoBancoDeDados').then(function () {
    console.log('Conectado com sucesso')
}).catch(function (erro) {
    console.log("Houve um erro ao se conectar ao MongoB: " + erro)
})

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

mongoose.model("usuarios", usuarioSchema)

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
