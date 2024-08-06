//Dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const morgan = require('morgan');

//Project files
const mysql__config = require('./config/MySqlConfig.js');
const funcoes = require('./config/funcoes.js');

//Init server
const port = 3000;
app.listen(port,()=>{
    console.log(`Servidor rodando em http://localhost:${port}`);
})

//Checking to see if the API is available
const API_AVAILABLE = true;
const API_VERSION = '1.0.0';

// Check if API is available
app.use((req,res,next)=>{
    if(API_AVAILABLE){
        next();
    }else{
        res.send(`Sorry, API in maitenance!`);
    }   
})


// MySql connection
const conection = mysql.createConnection(mysql__config);
conection.connect(error=>{
    if(error){
        console.log(`ERROR! : ${error.stack}`);
    }else{
        console.log(`Connection to MySql database successful !!!`);
    }
})

//Cors middleware
app.use(morgan('Metodo :method |  URL: :url | Status: :status '));
app.use(cors());


//Treate post params

//For parsing aplication json
app.use(express.json());
//For parsing application form url encoded;
app.use(express.urlencoded({extended:true}));

//Create
//Registering a new organization
app.post('/newOrganization',(req,res)=>{
    const post__data = req.body;
    const CNPJ = post__data.cnpj;
    const nomeOrganizacao = post__data.nome_organizacao;
    const localizacao = post__data.localizacao;
    const responsavel = post__data.responsavel;

    //Check if the data is empty.
    if(post__data == undefined){
        res.json(funcoes.response('Error!!','The request body is empty, please enter all data correctly',0,null));
        return;
    }

    //Check if the data is incomplete
    if(CNPJ == undefined || nomeOrganizacao == undefined || localizacao == undefined || responsavel == undefined ){
        res.json(funcoes.response('Error!','Incomplete data, please enter all data',0),null);
        return;
    }

    conection.query("INSERT INTO Organizacoes (cnpj , nome_organizacao , localizacao , responsavel) VALUES(?,?,?,?)" ,[CNPJ,nomeOrganizacao,localizacao,responsavel],(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Succes!!','All data was entered successfully',rows.affectedRows,null));
        }else{
            res.json(funcoes.response('Warning!',`ERROR!! : ${err.message}`,0,null));
        }
    })


})


// Registering strategies.
app.post('/newStrategy',(req,res)=>{
    const post__data = req.body;
    const tipo_estrategia = post__data.tipo_estrategia;
    const descricao = post__data.descricao;
    const efetividade = post__data.efetividade;

    //Check if the data is empty.
    if(post__data == undefined){
        res.json(funcoes.response('Error!!','The request body is empty, please enter all data correctly',0,null));
        return;
    }

    //Check if the data is incomplete
    if(tipo_estrategia == undefined || descricao == undefined || efetividade == undefined ){
        res.json(funcoes.response('Error!','Incomplete data, please enter all data',0),null);
        return;
    }

    conection.query("INSERT INTO Estrategias (tipo_estrategia , descricao , efetividade) VALUES (?,?,?)" ,[tipo_estrategia , descricao , efetividade],(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Succes!!','All data was entered successfully',rows.affectedRows,null));
        }else{
            res.json(funcoes.response('Warning!',`ERROR!! : ${err.message}`,0,null));
        }
    })


});

// Registering events.

app.post('/newEvent',(req,res)=>{
    const post__data = req.body;
    const nome_evento = post__data.nome_evento;
    const data_evento = post__data.data_evento;
    const localizacao_evento = post__data.localizacao_evento;
    const organizacao_id = post__data.organizacao_id;
    const estrategia_id = post__data.estrategia_id;

    // Check if the data is empty.
    if(post__data == undefined){
        res.json(funcoes.response('Error!!','The request body is empty, please enter all data correctly',0,null));
        return;
    }

    // Check if the data is incomplete
    if(nome_evento == undefined || data_evento == undefined || localizacao_evento == undefined || organizacao_id == undefined || estrategia_id == undefined){
        res.json(funcoes.response('Error!','Incomplete data, please enter all data',0),null);
        return;
    }

    conection.query("INSERT INTO Eventos (nome_evento , data_evento , localizacao_evento , organizacao_id , estrategia_id) VALUES (?,?,?,?,?)" ,[nome_evento , data_evento , localizacao_evento,organizacao_id,estrategia_id],(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Succes!!','All data was entered successfully',rows.affectedRows,null));
        }else{
            res.json(funcoes.response('Warning!',`ERROR!! : ${err.message}`,0,null));
        }
    });


});



//READ
// Read all organizations.
app.get('/organizations',(req,res)=>{
    conection.query('SELECT * FROM Organizacoes',(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Succes!!','Successful data visualization',rows.length,rows));
        }else{
            res.json(funcoes.response('Error!',`ERROR!:${err.message}`,0,null));
        }
    });
});

// Read a especific organization.
app.get('/organizations/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    conection.query('SELECT * FROM Organizacoes WHERE id_organizacao = ?',[id],(err,rows)=>{
        if(!err){
            if(rows.length>0){
                res.json(funcoes.response('Succes!!','Visualization of data from a specific successful organization!',rows.length,rows));
            }else{
                res.json(funcoes.response('ERROR!',"ERROR : This organization does not exist in the database",0,null));
            }
        }else{
            res.json(funcoes.response('Error!',`ERROR!:${err.message}`,0,null));
        }
    });
});




//Read all strategies
app.get('/strategies',(req,res)=>{
    conection.query('SELECT * FROM Estrategias',(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Succes!!','Successful data visualization',rows.length,rows));
        }else{
            res.json(funcoes.response('Error!',`ERROR!:${err.message}`,0,null));
        }
    });
});

//Read a especific estrategy
app.get('/strategies/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    conection.query('SELECT * FROM Estrategias WHERE id_estrategia = ?',[id],(err,rows)=>{
        if(!err){
            if(rows.length>0){
                res.json(funcoes.response('Succes!!','Viewing an strategy with specific id successful !',rows.length,rows));
            }else{
                res.json(funcoes.response('ERROR!',"ERROR : This strategy does not exist in the database",0,null));
            }
        }else{
            res.json(funcoes.response('Error!',`ERROR!:${err.message}`,0,null));
        }
    });
});



//Read all events
app.get('/events',(req,res)=>{
    conection.query('SELECT * FROM Eventos',(err,rows)=>{
        if(!err){
            res.json(funcoes.response('Succes!!','Successful data visualization',rows.length,rows));
        }else{
            res.json(funcoes.response('Error!',`ERROR!:${err.message}`,0,null));
        }
    });
});

//Read a especific event
app.get('/events/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    conection.query('SELECT * FROM Eventos WHERE id_evento = ?',[id],(err,rows)=>{
        if(!err){
            if(rows.length>0){
                res.json(funcoes.response('Succes!!','Viewing an event with specific id successful !',rows.length,rows));
            }else{
                res.json(funcoes.response('ERROR!',"ERROR : This event does not exists in the database",0,null));
            }
        }else{
            res.json(funcoes.response('Error!',`ERROR!:${err.message}`,0,null));
        }
    });
});



//UPDATE
app.put('/organizations/update/:id',(req,res)=>{
    const id = req.params.id;
    const update__data = req.body;
    const CNPJ = update__data.cnpj;
    const nomeOrganizacao = update__data.nome_organizacao;
    const localizacao = update__data.localizacao;
    const responsavel = update__data.responsavel;
     
    if (!update__data || Object.keys(update__data).length === 0) {
        res.status(404).json(funcoes.response('Error!', 'Empty data', 0, null));
        return;
    }

    //Update a especific data
    if(CNPJ || nomeOrganizacao|| localizacao|| responsavel ){
        if(CNPJ){
            conection.query("UPDATE Organizacoes SET cnpj = ? WHERE id_organizacao = ? ",[CNPJ,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','CNPJ atualizado com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar o CNPJ da empresa , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });

        }else if(nomeOrganizacao){
            conection.query("UPDATE Organizacoes SET nome_organizacao = ? WHERE id_organizacao = ? ",[nomeOrganizacao,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','Nome da organizacação atualizada com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar o CNPJ da empresa , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });

        }else if(localizacao.length>0){
            conection.query("UPDATE Organizacoes SET localizacao = ? WHERE id_organizacao = ? ",[localizacao,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','Localizacao da organizacação atualizada com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar a localização da empresa , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });
        }else if(responsavel.length>0){
            conection.query("UPDATE Organizacoes SET responsavel = ? WHERE id_organizacao = ? ",[responsavel,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','Nome do responsável da organização atualizado com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar o nome do responsável da empresa , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });
        }

    }

});






//Update a especific estrategie
app.put('/strategies/update/:id',(req,res)=>{
    const id = req.params.id;
    const update__data = req.body;
    const tipo_estrategia = update__data.tipo_estrategia;
    const descricao = update__data.descricao;
    const efetividade = update__data.efetividade;
     
    //Update a especific data
    if(tipo_estrategia || descricao|| efetividade ){

        if(tipo_estrategia){
            conection.query("UPDATE Estrategias SET tipo_estrategia = ? WHERE id_estrategia = ? ",[tipo_estrategia,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','Tipo de estratégia atualizada com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar a estrategia da empresa , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });

        }else if(descricao){
            conection.query("UPDATE Estrategias SET descricao = ? WHERE id_estrategia = ? ",[descricao,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','Descricao da estratégia da organizacação atualizada com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel a descrição da estratégia da organização , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });

        }else if(efetividade){
            conection.query("UPDATE Estrategias SET efetividade = ? WHERE id_estrategia = ? ",[efetividade,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','Efetividade da estratégia da organizacação atualizada com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar a efetividade da estratégia da empresa , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });
        }

    }

});


//Update a especific event

app.put('/events/update/:id',(req,res)=>{
    const id = req.params.id;
    const update__data = req.body;
    const nome_evento = update__data.nome_evento;
    const data_evento = update__data.data_evento;
    const localizacao_evento = update__data.localizacao_evento;
    const organizacao_id = update__data.organizacao_id;
    const estrategia_id = update__data.estrategia_id;

     
    //Update a especific data
    if(nome_evento|| data_evento || localizacao_evento || organizacao_id || estrategia_id){
        
        if(nome_evento){
            conection.query("UPDATE Eventos SET nome_evento = ? WHERE id_evento = ? ",[nome_evento,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','Nome do evento atualizado com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar o nome do evento , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });

        }else if(data_evento){
            conection.query("UPDATE Eventos SET data_evento = ? WHERE id_evento = ? ",[data_evento,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','Data do evento da organizacação atualizada com sucesso!',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar  a data  do evento da empresa , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });

        }else if(localizacao_evento){
            conection.query("UPDATE Eventos SET localizacao_evento = ? WHERE id_evento = ? ",[efetividade,id],(err,rows)=>{
                if(!err){
                    if(rows.affectedRows>0){
                        res.json(funcoes.response('Sucess!','A localização do evento da empresa foi atualizada com sucesso!! ',rows.affectedRows,null));
                    }else{
                        res.json(funcoes.response('Error!','Não foi possivel atualizar a localização do evento da empresa , pois o ID não consta no banco de dados',rows.affectedRows,null));
                    }
                }else{
                    res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
                }
            });
        }

    }

});


//DELETE

app.delete('/organizations/delete/:id',(req,res)=>{
    const id = req.params.id;
    conection.query("DELETE  FROM Organizacoes WHERE id_organizacao = ?",[id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows > 0){
                res.json(funcoes.response('Sucess!','Organização deletada com sucesso!',rows.affectedRows,null));
            }else{
                res.json(funcoes.response('ERROR!','ID da organização inválido, nenhuma operação foi feita',rows.affectedRows,null));
            }
        }else{
            res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
        }
    })
})


app.delete('/strategies/delete/:id',(req,res)=>{
    const id = req.params.id;
    conection.query("DELETE  FROM Estrategias WHERE id_estrategia = ?",[id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows > 0){
                res.json(funcoes.response('Sucess!','Estratégia deletada com sucesso!',rows.affectedRows,null));
            }else{
                res.json(funcoes.response('ERROR!','ID da estratégia inválido, nenhuma operação foi feita',rows.affectedRows,null));
            }
        }else{
            res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
        }
    });
});


app.delete('/events/delete/:id',(req,res)=>{
    const id = req.params.id;
    conection.query("DELETE  FROM Eventos WHERE id_evento = ?",[id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows > 0){
                res.json(funcoes.response('Sucess!','Evento deletado com sucesso!',rows.affectedRows,null));
            }else{
                res.json(funcoes.response('ERROR!','ID do evento inválido, nenhuma operação foi feita',rows.affectedRows,null));
            }
        }else{
            res.json(funcoes.response('ERROR!',`Erro: ${err.message}`,0,null));
        }
    })
})

//Endpoints
app.use((req,res)=>{
    res.json(funcoes.response('Warning','Route not found',0,null));
});