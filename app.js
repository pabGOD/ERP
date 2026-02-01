// importei o modulo express ok?
const express = require ('express')

//importei o express-handlebars
const { engine } = require ('express-handlebars')

// importando modulo mysql
const mysql = require('mysql2')

//app
const app = express();

// Adiconei o bootstrapzada aq ok?
app.use('bootstrap', express.static('./node_modules/bootstrap/dist'));

// Adiconar o Css ok?
app.use('/css', express.static('./css'))


//Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//manipulação de dados via rotas

app.use(express.json());
app.use(express.urlencoded({extended:false}));


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

//Rota de Cadastro 
app.post('/cadastrar', (req, res) =>{
    console.log(req.body);
    res.end();

})


// aqui vou abrir o servidor localhost blz?
app.listen(3000);
