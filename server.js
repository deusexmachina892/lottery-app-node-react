const express = require('express');
const bodyParser = require('body-parser');
const {save_user_information} = require('./models/server_db');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');
const config = require('config');
const app = express();


//app.use(express.json());
app.use(express.static(publicPath));
/*Handling all the parsing*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Paypal Config
paypal.configure({
    'mode': config.get('mode'), //sandbox or live
    'client_id': config.get('client_id'),
    'client_secret': config.get('client_secret')
  });

app.post('/post_info', async (req, res) => {
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
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3001/success",
                "cancel_url": "http://localhost:3001/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Lottery",
                        "sku": "funding",
                        "price": amount,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": amount
                },
                "payee":{
                    "email": "lottery-manager@test.com"
                },
                "description": "Lottery Purchase"
            }]
        };
        
        res.send(result);
    } catch(err){
        res.status(400).send('Could not save user info');
    }
});

app.get('/total_amount',async (req, res)=>{
    try{
        var result = await get_total_amount();
        res.send(result);
    } catch (err){
        res.send(err);
        }
});

const port = process.env.PORT || 3001
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
});