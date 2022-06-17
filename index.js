import express from 'express';
import { Book } from "../models/book.js";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static('./public')); 
app.use(express.urlencoded()); 
app.use(express.json()); 

import cors from 'cors';
app.use('/api', cors());

app.set("view engine", "ejs");

app.get('/', (req,res, next) => {
    Book.find({}).lean()
    .then((books) => {
        res.render('home_react', {items: JSON.stringify(books)});
    });
});

app.get('/detail', (req,res,next) => {
    Book.findOne({ title:req.query.title }).lean()
        .then((book) => {
            res.render('details', {result: book, title: req.query.title} );
        })
        .catch(err => next(err));
});

app.get('/about', (req,res) => {
    res.type('text/html');
    res.render('about');
});

// api's
app.get('/api/v1/book/:title', (req, res, next) => {
    let title = req.params.title;
    Book.findOne({title: title}, (err, result) => {
        if (err || !result) return next(err);
        res.json( result );    
    });
});

app.get('/api/v1/books', (req,res, next) => {
    Book.find((err,results) => {
        if (err || !results) return next(err);
        res.json(results);
    });
});

app.get('/api/v1/delete/:id', (req,res, next) => {
    Book.deleteOne({"_id":req.params.id }, (err, result) => {
        if (err) return next(err);
        res.json({"deleted": result});
    });
});

app.post('/api/v1/add/', (req,res, next) => {
    if (!req.body._id) { 
            let book = new Book(req.body);
        book.save((err,newBook) => {
            if (err) return next(err);
            res.json({updated: 0, _id: newBook._id});
        });
    } else { 
        Book.updateOne({ _id: req.body._id}, {title:req.body.title, author: req.body.author, pubdate: req.body.pubdate }, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified, _id: req.body._id});
        });
    }
});

app.get('/api/v1/add/:title/:author/:pubdate', (req,res, next) => {
    let title = req.params.title;
    Book.update({ title: title}, {title:title, author: req.params.author, pubdate: req.params.pubdate }, {upsert: true }, (err, result) => {
        if (err) return next(err); 
        res.json({updated: result.nModified});
    });
});

app.use((req,res) => {
    res.type('text/plain'); 
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');    
});