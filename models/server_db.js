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
    db.query('SELECT SUM(amount) AS total_amount FROM lottery_information', null, function(err, results, fields){
        if(err){
            reject('could not find total amount');
        }
        resolve(results);
    });
});

get_list_of_users = () => new Promise((resolve, reject) => {
    db.query('SELECT email FROM lottery_information', null, function(err, results, fields){
        if(err){
            reject('could not find the list of users');
        }
        resolve(results);   
    })
});

delete_all_users = () => new Promise(()=>{
    db.query('DELETE FROM lottery_information WHERE ID>0', null, function(err, results, fields){
        if(err){
            reject('Could not delete all entries');
        }
        resolve("Successfully deleted all users");
    })
})
module.exports = {
    save_user_information,
    get_total_amount,
    get_list_of_users,
    delete_all_users
}