const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');

app.set('view engine' , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/' , (req, res) => {
    res.render('registration.ejs')
});

app.get('/Note' , (req, res) => {
    res.render('index.ejs');
});

app.get('/Note/new' , (req, res) => {
    res.render('new.ejs');
});

app.listen(3000, () => console.log("server working"));
    res.render('index');
});
