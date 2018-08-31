var db = require('../db.js');

save_user_information = (data) =>  new Promise((resolve, reject)=>{
    db.query('INSERT INTO lottery_information SET ?', data, function(err, results, fields){
        if(err){
            reject('could not insert into lottery information');
        }
        resolve('Successful');
    });
});

get_total_amount = () =>  new Promise((resolve, reject)=>{
    db.query('SELECT SUM(amount) AS total_amount FROM lottery_information', function(err, results, fields){
        if(err){
            reject('could not find total amount');
        }
        resolve(results);
    });
});
module.exports = {
    save_user_information
}