var mysql = require("mysql");
var rfr = require('rfr');
var connstring = rfr("config/database");
var shortid = require('shortid');
module.exports = function (app) {
    // Save api ---------------------------------------------------------------------
    // get canvas object
    app.get('/api/getCanvas', function (req, res) {
        var id = req.query.id;
        console.log(id);
        var con = mysql.createConnection(connstring);
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            console.log('SELECT JSON from canvasmaster WHERE ID="' + id + '";');
            con.query('SELECT JSON from canvasmaster WHERE ID="' + id + '";', function (error, result) {
                if (error) throw error;
                res.status(200).send(result);
            });
        });
    });
    // save canvas object and return shortid
    app.post('/api/saveCanvas', function (req, res) {
        var id = shortid.generate();
        var jsondata = req.body;
        var data = JSON.stringify(jsondata);
        console.log(data);
        var con = mysql.createConnection(connstring);
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            con.query('INSERT into canvasmaster (ID,JSON) VALUES ("' + id + '", ?);', data, function (error) {
                if (error) throw error;
                res.status(200).send(id);
            });
        });
    });
    // application -------------------------------------------------------------
    app.get('/design', function (req, res) {
        res.sendfile('./public/Index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};