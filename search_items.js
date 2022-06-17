var http = require('http'),
	express = require('express'),
	items = require("../menu/items");

var app = express();
app.set('port', process.env.PORT || 3000);


var handlebars = require('express-handlebars').create({extname: '.hbs' });
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs' );

app.get('/', function(req,res){
    res.type('text/html');
    res.render('search_items');
});

app.get('/api/items/:kw/:loc', function(req,res){
    items.getItems(req.params.kw, req.params.loc, function(items_data) {
	    res.send(items_data); 
    });
});

app.listen(app.get('port'), function() {
    console.log('Express started');    
});