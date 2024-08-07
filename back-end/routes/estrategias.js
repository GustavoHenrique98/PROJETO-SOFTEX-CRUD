const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const MySqlConfig = require('../../config/MySqlConfig.js');
const funcoes = require('../../config/funcoes.js');
const conection = mysql.createConnection(MySqlConfig);


//Estrategias
router.post('/cadastro',(req,res)=>{
    const post__data = req.body;
    const tipo_estrategia = post__data.tipo_estrategia;
    const descricao = post__data.descricao;
    const efetividade = post__data.efetividade;
    
    //Verificando se os dados do corpo da requisição estão vazios
    if(post__data == undefined){
        res.json(funcoes.response('Error!','Corpo da requisição vazio',0,null));
        return;
    }
    //Verificando se algum dos dados está inválido;
    if(tipo_estrategia === undefined || descricao === undefined || efetividade === undefined ){
        res.status(404).json(funcoes.response('Error!','Dados incompletos',0,null));
        return;
    }

    conection.query('INSERT INTO Estrategias (tipo_estrategia , descricao , efetividade ) VALUES(?,?,?)',[tipo_estrategia, descricao, efetividade],(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Sucesso!','Dados inseridos corretamente na base de dados',rows.affectedRows,rows));
        }else{
            res.json(funcoes.response('Erro!',`ERROR! :${err.message}`,0,null));
        }
    })
})

router.get('/busca',(req,res)=>{
    conection.query('SELECT * FROM Estrategias',(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Sucesso','Dados visualizados com sucesso!',rows.length,null))
        }else{
            res.json(funcoes.response('ERROR! ',`Error ${err.message}`,0,null))

        }
    })
})

router.get('/busca/:id',(req,res)=>{
    const id = req.params.id;
    conection.query('SELECT * FROM Estrategias WHERE id_estrategia = ?',[id],(err,rows)=>{
        if(!err){
            if(rows.length>0){
                res.status(200).json(funcoes.response('Sucesso','Dados visualizados com sucesso!',rows.length,rows));
            }else{
                res.status(404).json(funcoes.response('ERRO!','O id da estrategia não costa no banco de dados',0,null));
            }
        }else{
            res.json(funcoes.response('ERROR! ',`Error ${err.message}`,0,null));

        }
    })
})



module.exports = router;