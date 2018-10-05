const express = require('express');
const path = require('path');
const axios = require('axios');

let app = express();
let stars =  ()=> console.log("*".repeat(50));
let dashes = ()=> console.log("-".repeat(50));

app.set( 'views', path.join(__dirname,"./views") );
app.set( 'view engine', 'ejs' );


let counter = 1 ;
let arr=[];
let peopleFlag , planetsFlag ;

app.get('/', function(req,res){
    res.render('index', { counter: counter });
})

// people get
app.get('/people', function(req,res){    
    console.log("hit people route");
    if(planetsFlag){
        counter = 1;
    } 
    peopleFlag = true, planetsFlag = false;
    axios.get('https://swapi.co/api/people/?page='+counter)                
    .then(data => {
// rewriting the response object to avoid dealing with circular json and reduce load on browser :)
        let retObj = data.data.results.map(v => v.name); 
        retObj.push(counter);
        res.json(retObj);
    })    
    .catch(error => {
        console.log(error);
        res.json(error);
    })

});

// planets get
app.get('/planets', function(req,res){
    console.log("hit people route");
    if(peopleFlag){
        counter = 1;
    } 
    peopleFlag = false, planetsFlag = true;
    axios.get('https://swapi.co/api/planets/?page='+counter)                
    .then(data => {
        let retObj = data.data.results.map(v => v.name); 
        retObj.push(counter);
        res.json(retObj);
    })    
    .catch(error => {
        console.log(error);
        res.json(error);
    })

});

// next
app.get('/next', function(req,res){
    console.log("hit next route");    
    if(peopleFlag){
        url = 'https://swapi.co/api/people/?page='+counter;    
        if(counter< 9){counter++;}
    } 
    else{
        url = 'https://swapi.co/api/planets/?page='+counter;
        if(counter< 7){counter++;}
    }
    axios.get(url)                
    .then(data => {
        let retObj = data.data.results.map(v => v.name); 
        retObj.push(counter);
        res.json(retObj);
    })    
    .catch(error => {
        console.log(error);
        res.json(error);
    })

});

// previous
app.get('/previous', function(req,res){
    console.log("hit next route");    
    if(counter<=1){return null;}
    counter-=1;    
    url = (peopleFlag)? 'https://swapi.co/api/people/?page='+counter :'https://swapi.co/api/planets/?page='+counter;
    axios.get(url)                
    .then(data => {
        let retObj = data.data.results.map(v => v.name); 
        retObj.push(counter);
        res.json(retObj);
    })    
    .catch(error => {
        console.log(error);
        res.json(error);
    })
});

// all 
// to-do: calls still only return 10 results, need to recurse calling and listening while less than total # pages 
// app.get('/all', function(req,res){
//     console.log("hit all route");    
//     counter=1;    
//     url = (peopleFlag)? 'https://swapi.co/api/people/' : 'https://swapi.co/api/planets/';
//     axios.get(url)                
//     .then(data => {
//         console.log(data.data.results);        
//         let retObj = data.data.results.map(v => v.name); 
//         retObj.push(counter);
//         console.log("finished all route");    
//         res.json(retObj);
//     })    
//     .catch(error => {
//         console.log(error);
//         res.json(error);
//     })
// });

app.listen( 8000, ()=>console.log("listening on 8000") )