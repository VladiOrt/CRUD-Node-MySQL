const express = require('express');
const bodyParser =  require('body-parser');
var mysql = require('mysql');
const { response } = require('express');
const App = express();

App.use(express.json());
App.use(express.urlencoded({extended:true}))


/* CONEXION A LA BASE DE DATOS */
let Connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'scrum'
});


App.get('/proyectos', function(Req, Res){
    const GetAll = "SELECT * FROM proyectos";
    Connection.query(GetAll , function(Error, Rows, Cols){
        if(Error){
            Res.write(JSON.stringify({
                error: true,
                error_object : Error
            }));
            Res.end();
        }else{
            Res.write(JSON.stringify(Rows));
            Res.end();
        }
    });
});


/* CREATE */
function Create(Data, Response){
    let Create = "INSERT INTO proyectos(name, objective, productOwner, daySprint, team, sprints, dateinit, dateend) VALUES (";
    Create += "'" + Data.name + "',";
    Create += "'" + Data.objective + "',";
    Create += "'" + Data.productOwner + "',";
    Create += "'" + Data.daySprint + "',";
    Create += "'" + Data.team + "',"; 
    Create += "'" + Data.sprints + "',";
    Create += "'" + Data.dateinit + "',";
    Create += "'" + Data.dateend + "')";
    
    Connection.query(Create, function(Error, Rows, Cols){
        if(Error){
            Response.write(JSON.stringify({
                error: true, 
                error_object: Error
            }));
            Response.end();
        }else{
            const IdCreated = Rows.insertId;
            Response.write(JSON.stringify({
                Error: false,
                IdCreated: IdCreated
            }));
            Response.end();
        }
    });

}

/* READ */
function Read(Response){
    let Read = "SELECT * FROM proyectos";
    Connection.query(Read, function(Error, Rows, Cols){
        if(Error){
            Response.write(JSON.stringify({
                error: true,
                error_object: Error
            }));
            Response.end();
        }else{
            Response.write(JSON.stringify({
                erro: false,
                data: Rows
            }));
            Response.end();
        }
    });
}

/* UPDATE */
function Update(Data, Response){
    let Update = "UPDATE proyectos SET ";    
    if(Data.name){
        Update += "name= '"+ Data.name +"'";
    }    
    if(Data.objective){
        Update += ", objective= '"+ Data.objective +"'";
    }    
    if(Data.productOwner){
        Update += ", productOwner= '"+ Data.productOwner +"'";
    }    
    if(Data.daySprint){
        Update += ", daySprint= '"+ Data.daySprint +"'";
    }    
    if(Data.team){
        Update += ",team= '"+ Data.team +"'";
    }    
    if(Data.sprints){
        Update += ", sprints= '"+ Data.sprints +"'";
    }    
    if(Data.dateinit){
        Update += ", dateinit= '"+ Data.dateinit +"'";
    }      
    if(Data.dateend){
        Update += ", dateend= '"+ Data.dateend +"'";
    }

    Update += "WHERE idProyect = '" + Data.idProyect + "'";

    Connection.query(Update, function(Error, Rows, Cols){
        if(Error){
            Response.write(JSON.stringify({
                error: true,
                error_object: Error
            }));
            response.end();
        }else{
            Response.write(JSON.stringify({
                error: false
            }));
            Response.end();
        }
    });
}


/* DELETE */
function Delete(Data, Response){
    let Delete = "DELETE FROM gato WHERE idgato = '"+ Data.idgato + "'";

    Connection.query(Delete, function(Error, Rows, Cols){
        if(Error){
            Response.write(JSON.stringify({
                error: true,
                error_object: Error
            }));
            Response.end();
        }else{
            Response.write(JSON.stringify({
                error:false
            }));
            Response.end();
        }
    });
}






App.post('/proyecto', function(Req, Res) {
    var Data = {};
    var Operation = '';
    
    Data = Req.body.DataOperation;
    Operation = Req.body.Operation;
    
    switch(Operation) {
      
      case 'CREATE':      
       Create(Data, Res);
      break;
      
      case 'READ':
       Read(Res);
      break;
      
      case 'UPDATE':
       Update(Data, Res);
      break;
      
      case 'DELETE':
       Delete(Data, Res);
      break;
      
      default:
       Res.write(JSON.stringify({ 
         error: true, 
         error_message: 'Debes proveer una operación a realizar' 
       }));
       Res.end();
      break;
      
    }   
  });

  const PORT = 3000

  App.listen(PORT, function(Req, Res) {
    console.log("Servidor escuchando por el puerto "+ PORT);   
  });




  /* TESTEO */
/*
 ####   READ   ###
    {"Operation": "READ"}
    CREATE
 ###   CREATE  ###
    {
     "Operation": "CREATE",
     "DataOperation": {
           "name": "",
           "objective": "",
           "productOwner": "",
           "daySprint": "",
           "team": "",
           "sprint": "",
           "dateinit": "",
           "dateend": ""
    }
}
 ###  UPDATE   ###
    {
        "Operation": "UPDATE",
        "DataOperation": {
           "id_gato": "",
           "campo(s)_a_actualizar": ""
        }
    }
 ###  DELETE   ###
    {
        "Operation": "DELETE",
        "DataOperation": {
            "id_gato": "" 
        }
    }    
  
*/