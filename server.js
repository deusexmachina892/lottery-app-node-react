const express = require('express');
const bodyParser = require('body-parser');
const {save_user_information} = require('./models/server_db');
const app = express();


//app.use(express.json());
/*Handling all the parsing*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', async (req, res) => {
    var email = req.body.email;
    var amount = req.body.amount;

    if(amount <= 1){
        return_info = {};
        return_info.error = true;
        return_info.message = "Amount should be greater than 1";
        return res.send(return_info);
    }
    try{
        var result =  await save_user_information({"email": email,"amount": amount});
        res.send(result);
    } catch(err){
        res.status(400).send('Could not save user info');
    }
});

const port = process.env.PORT || 3001
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
});