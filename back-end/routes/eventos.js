const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const MySqlConfig = require('../../config/MySqlConfig.js');
const funcoes = require('../../config/funcoes.js');
const conection = mysql.createConnection(MySqlConfig);


//Evento
router.post('/cadastro',(req,res)=>{
    const post__data = req.body;
    const nome_evento = post__data.nome_evento;
    const data_evento = post__data.data_evento;
    const localizacao_evento = post__data.localizacao_evento;
    const organizacao_id = post__data.organizacao_id;
    const estrategia_id = post__data.estrategia_id;
    
    //Verificando se os dados do corpo da requisição estão vazios
    if(post__data == undefined){
        res.json(funcoes.response('Error!','Corpo da requisição vazio',0,null));
        return;
    }
    //Verificando se algum dos dados está inválido;
    if(nome_evento === undefined || data_evento === undefined || localizacao_evento === undefined || organizacao_id === undefined || estrategia_id === undefined){
        res.status(404).json(funcoes.response('Error!','Dados incompletos',0,null));
        return;
    }

    conection.query('INSERT INTO Eventos ( nome_evento, data_evento , localizacao_evento , organizacao_id , estrategia_id ) VALUES(?,?,?,?,?)',[nome_evento, data_evento,localizacao_evento, organizacao_id, estrategia_id],(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Sucesso!','Dados inseridos corretamente na base de dados',rows.affectedRows,rows));
        }else{
            res.json(funcoes.response('Erro!',`ERROR! :${err.message}`,0,null));
        }
    });

});

router.get('/busca',(req,res)=>{
    conection.query('SELECT * FROM Eventos',(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Sucesso!','Dados visualizados corretamente',rows.length,rows))
        }else{
            res.json(funcoes.response('Sucesso!','Dados visualizados corretamente',0,null))

        }
    })
})

router.get('/busca/:id',(req,res)=>{
    const id = req.params.id;
    conection.query('SELECT * FROM Eventos WHERE id_evento = ?',[id],(err,rows)=>{
        if(!err){
            if(rows.length>0){
                res.status(200).json(funcoes.response('Sucesso','Dados visualizados com sucesso!',rows.length,rows));
            }else{
                res.status(404).json(funcoes.response('ERRO!','O id do evento não costa no banco de dados',0,null));
            }
        }else{
            res.json(funcoes.response('ERROR! ',`Error ${err.message}`,0,null));

        }
    })
});


module.exports = router;