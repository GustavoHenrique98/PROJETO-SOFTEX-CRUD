const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const MySqlConfig = require('../../config/MySqlConfig.js');
const funcoes = require('../../config/funcoes.js');
const conection = mysql.createConnection(MySqlConfig);

//Organizacao
router.post('/cadastro',(req,res)=>{
    const post__data = req.body;
    const cnpj = post__data.cnpj;
    const nome_organizacao = post__data.nome_organizacao;
    const localizacao_organizacao = post__data.localizacao_organizacao;
    const responsavel = post__data.responsavel;
    
    //Verificando se os dados do corpo da requisição estão vazios
    if(post__data == undefined){
        res.json(funcoes.response('Error!','Corpo da requisição vazio',0,null));
        return;
    }
    
    //Verificando se algum dos dados está inválido;
    if(cnpj === undefined || nome_organizacao === undefined || localizacao_organizacao === undefined || responsavel === undefined){
        res.status(404).json(funcoes.response('Error!','Dados incompletos',0,null));
        return;
    }

    conection.query('INSERT INTO Organizacoes (cnpj,nome_organizacao,localizacao_organizacao,responsavel) VALUES(?,?,?,?)',[cnpj, nome_organizacao, localizacao_organizacao , responsavel],(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Sucesso!','Dados inseridos corretamente na base de dados',rows.affectedRows,rows));
        }else{
            res.json(funcoes.response('Erro!',`ERROR! :${err.message}`,0,null));
        }
    });


    
})


//Get organização
router.get('/busca',(req,res)=>{
    conection.query('SELECT * FROM Organizacoes',(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Sucesso','Dados visualizados com sucesso!',rows.length,null))
        }else{
            res.json(funcoes.response('ERROR! ',`Error ${err.message}`,0,null))

        }
    })
})

router.get('/busca/:id',(req,res)=>{
    const id = req.params.id;
    conection.query('SELECT * FROM Organizacoes WHERE id_organizacao = ?',[id],(err,rows)=>{
        if(!err){
            if(rows.length>0){
                res.status(200).json(funcoes.response('Sucesso','Dados visualizados com sucesso!',rows.length,rows));
            }else{
                res.status(404).json(funcoes.response('ERRO!','O id da organização não costa no banco de dados',0,null));
            }
        }else{
            res.json(funcoes.response('ERROR! ',`Error ${err.message}`,0,null));

        }
    });
});

//Update
router.put('/atualizar/:id', (req, res) => {
    const id = req.params.id;
    const update_data = req.body;
    const cnpj = update_data.cnpj;
    const nome_organizacao = update_data.nome_organizacao;
    const localizacao_organizacao = update_data.localizacao_organizacao;
    const responsavel = update_data.responsavel;

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
  
    if (cnpj){
      fields.push('cnpj = ?');
      values.push(cnpj);
    }

    if(nome_organizacao){
      fields.push('nome_organizacao = ?');
      values.push(nome_organizacao);
    }

    if (localizacao_organizacao) {
      fields.push('localizacao_organizacao =?');
      values.push(localizacao_organizacao);
    }

    if (responsavel) {
      fields.push('responsavel = ?');
      values.push(responsavel);
    }
  
    // Adicionar o ID no array de valores
    values.push(id);
  
    //Se a quantidade do array fields(campos) for maior que zero transforme 
    //as strings em um texto para query ser efetuada corretamente e de maneira dinâmica.
    if (fields.length > 0) {

      const query = `UPDATE Organizacoes SET ${fields.join(', ')} WHERE id_organizacao = ?`;
      conection.query(query, values, (err, result) => {
        
        if(!err){
            if (result.affectedRows > 0) {
              res.json(funcoes.response('Sucesso!', 'Dados atualizados com sucesso!', result.affectedRows, null));
            
            }else{
              res.status(404).json(funcoes.response('Error!', 'Não foi possível atualizar os dados, pois o ID não consta no banco de dados', result.affectedRows, null));
            
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
    conection.query('DELETE FROM Organizacoes WHERE id_organizacao = ?',[id],(err,rows)=>{
      if(!err){
        if(rows.affectedRows > 0 ){
            res.json(funcoes.response('Sucesso!','Organização deletada com sucesso!',rows.affectedRows,null));
        }else{
            res.status(404).json(funcoes.response('Erro!','O id da organização não consta no banco de dados!!',rows.affectedRows,null));
            
        }
      }else{
        res.json(funcoes.response('Error!',`Erro:${err.message} `,0,null));
      }
    });

  });

module.exports = router