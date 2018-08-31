const express = require('express');
const bodyParser = require('body-parser');
const app = express();


//app.use(express.json());
/*Handling all the parsing*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', (req, res) => {
    var email = req.body.email;
    var amount = req.body.amount;

    if(amount <= 1){
        return_info = {};
        return_info.error = true;
        return_info.message = "Amount should be greater than 1";
        return res.send(return_info);
    }

    res.send({"email" : email, "amount": amount});
});

const port = process.env.PORT || 3001
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
});