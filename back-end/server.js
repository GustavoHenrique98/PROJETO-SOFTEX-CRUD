//Import dependecies
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2');


//import configs and functions
const funcoes = require('../config/funcoes.js');
const MySqlConfig = require('../config/MySqlConfig.js');
  
//Disponibilidade da API.
const API_AVAILABLE = true;
const API_VERSION = '1.0.0';

app.use((req,res,next)=>{
    if(API_AVAILABLE){
        next();
    }else{
        res.json(funcoes.response('Erro!','Api em manutenção!!!'));
    }
})

//Conectando com o banco de dados mysql.
const conection = mysql.createConnection(MySqlConfig);

//Checando se a conexão foi efetuada com sucesso.
conection.connect(error=>{
    if(error){
        console.log(`ERRO! :${error.stack}`);
    }else{
        console.log(`Conexão efetuada com sucesso!!`);
    }
})

//Middlewares globais
app.use(morgan('Metodo :method |  URL: :url | Status: :status '));
app.use(cors());

//Tratando parametros do post
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Rotas 
app.use('/organizacao', require('./routes/organizacao'));
app.use('/estrategias', require('./routes/estrategias'));
app.use('/eventos', require('./routes/eventos'));



//Abrindo o server
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');   
})


app.use((req,res)=>{
    res.status(404).send('Rota não encontrada!!!');
})