// importei o modulo express ok?
const express = require ('express')

//importei o express-handlebars
const { engine } = require ('express-handlebars')

// importando modulo mysql
const mysql = require('mysql2')

//app
const app = express();

//Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


// config de conexao 
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '251102',
    database: 'projeto'
});

// testando essa conexao ai que criei
conexao.connect(function(erro){
if (erro) throw erro;
console.log ('conexao efetuada com tudo tranquilo')
});

// Rota principal
app.get('/', function (req, res){
    res.render('formulario');
})


// aqui vou abrir o servidor localhost blz?
app.listen(3000);
