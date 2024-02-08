const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product', (req, res, next)=>{
    res.send('<h1>Hello from Add product page</h1>')
});


app.use('/', (req, res, next)=>{
    res.send('<h1>Hello from NodeJs</h1>')
});

app.use((req, res, next)=>{
    res.status(404).send("<h1>Page not found</h1>")
})


app.listen(3000);
