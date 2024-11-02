const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');

app.set('view engine' , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.get('/' , (req, res) => {
    res.send('Dev');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${PORT}`);
  });