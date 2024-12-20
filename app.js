require("dotenv").config();  // to read .env file (environment variable)
const express = require('express');
const path = require('path');
const noteRouter = require('./routers/noteRouter');
const userRouter = require('./routers/userRouter');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine' , "ejs"); 
app.use(cookieParser());
app.use(express.json());
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

//Routing 
app.use('/api/user/', userRouter);
app.use('/api/note/', noteRouter);

// Routing parameters
app.get('/' , (req, res) => {
    res.render('dashboard');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port http://localhost:3000/`);
  });
  