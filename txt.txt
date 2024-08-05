//Requires
const express = require('express');
const mysql  = require('mysql2');
const cors = require('cors');
const port = 3000;

// Import Mysql config and functions (project files).
const mysql__config = require('../config/mySqlConfig');
const funcoes = require('../config/functions.js');

//init server
const app = express();
app.listen(port,()=>{
  console.log(`Servidor iniciado com sucesso!`);
});

// Check if API is Available
const API_AVAILABILITY = true;
const API_VERSION = "1.0.0";
app.use((req,res,next)=>{
    if(API_AVAILABILITY){
      next();    
    }else{
      res.send(`Sorry, API in maitenance!`);
    }
});

//Mysql conection 
const conection = mysql.createConnection(mysql__config);
conection.connect(error=>{
    if(error){
        console.log(`Erro!!:${error.stack}`);
    }else{
        console.log(`Conexão com o mysql efetuada com sucesso!`);
    }
});

//Cors middleware
app.use(cors());

//Treat post params
app.use(express.json()) //for parsing aplication json
app.use(express.urlencoded( {extended:true})); //for parsing application  form url encoded;

//Routes
app.get('/',(req,res)=>{
    res.json(funcoes.response('Success!','API is runinng!',0,null));
});

//List all users in the database usuarios
app.get('/users',(req,res)=>{
    conection.query('SELECT * FROM usuarios',(err,rows)=>{
        let response = null;
        if(!err){
            response = funcoes.response('Success!','Users listed successfully!',rows.length,rows);
            res.json(response);
        }else{
            response = funcoes.response('Error!',err.message,0,null);
            res.json(response);
        }
    })
})

// listing a specific user by id
app.get('/users/:id',(req,res)=>{
    const id = req.params.id;
    conection.query('SELECT * FROM usuarios WHERE id_usuario = ?',[id],(err,rows)=>{
        let response = null;
        if(!err){
            if(rows.length > 0){
                response = funcoes.response('Success!','User listed successfull!',rows.length,rows);
                res.json(response);
            }else{
                response = funcoes.response('Error!!!','User not found',rows.length,null);
                res.json(response);
            }
        }else{
            response = funcoes.response('ERROR!',err.message,rows.length,null)
        }
    })
})


//Update a user password;
app.put('/users/update/password/:id/:password',(req,res)=>{
    const id = req.params.id;
    const password = req.params.password;
    conection.query('UPDATE usuarios SET password = ? WHERE id_usuario = ?',[password,id],(err,rows)=>{
        let response = null;
        if(!err){
            if(rows.affectedRows > 0){
                response = funcoes.response('Sucess!','The password has been updated',rows.affectedRows,null);
                res.json(response);
            }else{
                response = funcoes.response('Warning!','The user id does not match any account in the database',rows.affectedRows,null);
                res.json(response);
            }
        }else{
            response = funcoes.response('ERROR!',err.message,0,null);
        }
    });
})

//Delete a especific user 

app.delete('/users/delete/:id',(req,res)=>{
    const id = req.params.id;    
    conection.query('DELETE FROM usuarios WHERE id_usuario = ? ',[id],(err,rows)=>{
        let response = null;
        if(!err){
            if(rows.affectedRows > 0 ){
                response = funcoes.response('Success!','User deleted succesfull',rows.affectedRows,null);
                res.json(response)
            }else{
                response = funcoes.response('Error!','Invalid user id',rows.affectedRows,null);
                res.json(response);
            }
        }else{
            response = funcoes.response('ERROR!',err.message,0,null);
            res.json(response);
        }
    });
});

//Creating a new user 

app.post('/users/newuser',(req,res)=>{
    //Requisition body
    const post__data = req.body;
    const username = post__data.username;
    const password = post__data.password;
    const email = post__data.email;
    
    let response = null;
    //Check if the data is empty;
    if(post__data == undefined){
        res.json(funcoes.response('ERROR!!!','Undefined data',0,null));
        return
    }
    
    // Check if the data is incomplete.
    if(username === undefined || password === undefined || email === undefined){
        response = funcoes.response('ERROR!!!','Incomplete data, please fill in all data',rows.affectedRows,null) 
        res.json(response);
        return
    }
    
    //Insert in the table usuarios
    conection.query('INSERT INTO usuarios(username,password,email) VALUES (?,?,?)',[username,password,email],(err,rows)=>{
        if(!err){
            response = funcoes.response('Success','Success, the data was entered correctly!!!',rows.affectedRows,null); 
            res.json(response);
        }else{
            response = funcoes.response('Error!',err.message,0,null) 
            res.json(response);

        }
    });
});

//Endpoints
app.use((req,res)=>{
    res.json(funcoes.response('Warning','Route not found',0,null));
});