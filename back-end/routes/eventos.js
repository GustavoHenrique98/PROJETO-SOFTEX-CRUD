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



router.put('/atualizar/:id', (req, res) => {
    const id = req.params.id;
    const update_data = req.body;
    const nome_evento = update_data.nome_evento;
    const data_evento = update_data.data_evento;
    const localizacao_evento = update_data.localizacao_evento;
    const organizacao_id = update_data.organizacao_id;
    const estrategia_id = update_data.estrategia_id;

   //Debugs
   //Se o json não tiver dados || tiver dados e não possuir valores ele chama esta condição
   //Encerrando a aplicação.
    if (!update_data || Object.keys(update_data).length === 0) {
      res.status(404).json(funcoes.response('Error!', 'Empty data', 0, null));
      return;
    }
  

    // Construir dinamicamente a query SQL
    //Aqui temos dois arrays para adicionar dinamicamente valores em string e do corpo da requisição
    //Esses valores só são adicionados se existir propriedades com esses valores preenchidos.
    //Então caso esses valores estejam presentes, sua respectiva query será utilizada  
    let fields = [];
    let values = [];
  
    if (nome_evento){
      fields.push('cnpj = ?');
      values.push(nome_evento);
    }

    if(data_evento){
      fields.push('nome_organizacao = ?');
      values.push(data_evento);
    }

    if (localizacao_evento) {
      fields.push('localizacao_evento = ?');
      values.push(localizacao_evento);
    }

    if (organizacao_id) {
      fields.push('organizacao_id = ?');
      values.push(organizacao_id);
    }
    if (estrategia_id) {
        fields.push('estrategia_id = ?');
        values.push(estrategia_id);
      }
  
    // Adicionar o ID após o ultimo índice do  array de valores
    values.push(id);
  
    //Se a quantidade do array fields(campos) for maior que zero transforme 
    //as strings em um texto para query ser efetuada corretamente e de maneira dinâmica.
    if (fields.length > 0) {

      const query = `UPDATE Eventos SET ${fields.join(', ')} WHERE id_evento = ?`;
      conection.query(query, values, (err, result) => {
        
        if(!err){
            if (result.affectedRows > 0) {
              res.json(funcoes.response('Sucesso!', 'Dados atualizados com sucesso!', result.affectedRows, null));
            
            }else{
              res.json(funcoes.response('Error!', 'Não foi possível atualizar os dados, pois o ID do evento não consta no banco de dados', result.affectedRows, null));
            
            }
        }else{
          res.json(funcoes.response('ERROR!', `Erro: ${err.message}`, 0, null));
          return;
        }
      });

    }else{
      res.status(404).json(funcoes.response('Error!', 'Nenhum campo válido para atualizar', 0, null));
    }
  });


  //Delete
  router.delete('/delete/:id',(req,res)=>{
    const id = req.params.id;
    conection.query('DELETE FROM Eventos WHERE id_evento = ?',[id],(err,rows)=>{
      if(!err){
        if(rows.affectedRows > 0 ){
            res.json(funcoes.response('Sucesso!','Evento deletado com sucesso!',rows.affectedRows,null));
        }else{
            res.json(funcoes.response('Erro!','O id do evento não consta no banco de dados!!',rows.affectedRows,null));
            
        }
      }else{
        res.json(funcoes.response('Error!',`Erro:${err.message} `,0,null));
      }
    });

  });

module.exports = router;