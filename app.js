// importei o modulo express ok?
const express = require("express");

// FILE SYSTEM (modulo NATIBVO do node para manipular arquivos)
const fs = require("fs");

// importar modulo fileupload (aquele modulo do express pra olhar imagens que foram uploads)
const fileUpload = require("express-fileupload");

//importei o express-handlebars
const { engine } = require("express-handlebars");

// importando modulo mysql
const mysql = require("mysql2");

//app
const app = express();

// habilitando o upload de arquivos ok?
app.use(fileUpload());

// Adiconei o bootstrapzada aq ok?
app.use("bootstrap", express.static("./node_modules/bootstrap/dist"));

// Adiconar o Css ok?
app.use("/css", express.static("./css"));

// Referenciar a pasta de imagens (colocar para aparecer na tela a imagem que foi cadastrada)
app.use("/imagens", express.static("./imagens"));

//Configuração do express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//manipulação de dados via rotas

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// config de conexao
const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "251102",
  database: "projeto",
});

// testando essa conexao ai que criei
conexao.connect(function (erro) {
  if (erro) throw erro;
  console.log("conexao efetuada com tudo tranquilo");
});

// Rota principal
app.get("/", function (req, res) {
  // SQL para selecionar os produtos
  let slq = "SELECT * FROM produtos";
  // Executar o comando SQL
  conexao.query(slq, function (erro, retorno) {
    res.render("formulario", { produtos: retorno });
  });

  //Rota de Cadastro
  app.post("/cadastrar", (req, res) => {
    // aqui vou obter os dados que serão utilizados para o cadastro ok?
    let nome = req.body.nome;
    let valor = req.body.valor;
    let status = req.body.status;
    let imagem = req.files.imagem.name;

    // estrutura SQL
    let sql = `INSERT INTO produtos (nome, valor, status, imagem) VALUES ('${nome}', ${valor}, '${status}', '${imagem}')`;

    //EXECUTAR COMANDO SQL
    conexao.query(sql, function (erro, retorno) {
      //CASO OCORRA ALGUM ERRO
      if (erro) throw erro;

      // CASO OCORRA O CADASTRO
      req.files.imagem.mv(__dirname + "/imagens/" + req.files.imagem.name);
    });
    //RETORNAR PARA A ROTA PRINCIPAL
    res.redirect("/");
  });
});

//ROTA PARA REMOVER OS PRODUTOS
app.get("/remover/:codigo&:imagem", (req, res) => {
  //SQL
  let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

  //EXECUTAR O COMANDO SQL
  conexao.query(sql, function (erro, retorno) {
    //caso FALHE O COMANDO SQL
    if (erro) throw erro;

    // agora caso o comando sql funcione hehe baby
    fs.unlink(__dirname + "/imagens/" + req.params.imagem, (erro_imagem) => {
      console.log("falha ao remover a imagem");
    });
  });

  //REDIRECIONAMENTO
  res.redirect("/");
});

// ROTA PARE REDIRECIONAR PARA O FOMULARDIO DE ALTERAÇÃO/EDIÇÃO
app.get("/formularioEditar/:codigo", (req, res) => {
  //SQL
  let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

  //EXECUTAR O COMANDO SQL
  conexao.query(sql, function (erro, retorno) {
    //caso FALHE O COMANDO SQL
    if (erro) throw erro;

    //CASO CONSIGA EXECUTAR O COMANDO SQL
    res.render("formularioEditar", { produto: retorno[0] });
  });
});


// ROTA PARA EDITAR O PRODUTOS 
app.post("/editar", (req, res) => {
  // aqui vou obter os dados que serão utilizados para o cadastro ok?
  let nome = req.body.nome;
  let valor = req.body.valor;
  let status = req.body.status;
  let codigo = req.body.codigo;
  let nomeImagem = req.body.nomeImagem;
  let imagem = req.files.imagem.name;
  //exibir os dados
  console.log(nome);
  console.log(valor);
  console.log(status);
  console.log(codigo);
  console.log(nomeImagem);
  console.log(imagem);

  //FINALIZAR A ROTA
  res.end();

});


// aqui vou abrir o servidor localhost blz?
app.listen(3000);
