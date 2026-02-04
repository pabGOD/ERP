// importei o modulo express ok?
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
// importar modulo fileupload (aquele modulo do express pra olhar imagens que foram uploads)

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
  res.render("formulario");
});

function salvarImagem(imagem) {
  const diretorio = path.join(__dirname, "imagens");

  if (!fs.existsSync(diretorio)) {
    fs.mkdirSync(diretorio, { recursive: true });
  }

  const caminhoArquivo = path.join(diretorio, imagem.name);

  fs.writeFileSync(caminhoArquivo, imagem.data);
}

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

    //RETORNAR PARA A ROTA PRINCIPAL
    salvarImagem(req.files.imagem);
    res.redirect("/");
  });
});

// aqui vou abrir o servidor localhost blz?
app.listen(3000);
