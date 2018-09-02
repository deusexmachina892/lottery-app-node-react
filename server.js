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
    'mode': config.get("paypal").mode, //sandbox or live
    'client_id': config.get("paypal").client_id,
    'client_secret': config.get("paypal").client_secret
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
    var net_amount_after_fee = amount * 0.9;
    try{
        var result =  await save_user_information({"email": email,"amount": net_amount_after_fee});
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

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                for(var i = 0; i < payment.links.length; i++){
                    if(payment.links[i].rel == 'approval_url'){
                        return res.send(payment.links[i].href);
                    }
                }
            }
        });
        
       // res.send(result);
    } catch(err){
        res.status(400).send('Could not save user info');
    }
});


app.get('/success', (req, res) =>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    var execute_payment_json ={
        "payer_id": payerId,
        "transactions":[{
            "amount": {
                "currency": "USD",
                "total" : 100
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function(err, payment){
        if(err){
            console.log(err.response);
            throw err;
        } else {
            console.log(payment);
            res.redirect('http://localhost:3001');  
        }
    });
    
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