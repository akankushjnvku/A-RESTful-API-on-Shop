const express=require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');





const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://node-shop:"+ process.env.MONGO_ATLAS_PW +"@node-rest-shop.f9b3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});





app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use((req,res,next)=>{
    res.header("Acess-Control-Allow-Origin","*");
    res.header(
        "Acess-Control-Allow-Headers",
        "Origin, X-Requested-With, Context-Type, Accept, Authorization");
    if(req.method==='OPTIONS'){
        res.header('Acces-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});

    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    const error=new Error('Not Found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});



module.exports=app;