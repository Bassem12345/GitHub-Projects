const winston=require('winston');
const mongoose=require('mongoose');
const config=require('config');

module.exports=function(){
    conString=config.get('db');
    mongoose.connect(conString)
.then(()=>{winston.info(`Connected to ${conString} database successfully`)});

};