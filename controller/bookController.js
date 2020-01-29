const books = require('../models/books')

module.exports = {
    getBooks: function (req, res) {
        books.findAll()
        .then(books => {
            // TODO update books response and send
            res.status(200).json({status:'success', messgae:'',books:books});
        })
        .catch(err => {
            console.log("error while get",err)
            res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
        })
    },
    serachBook: function(req,res){
        let title  = req.query.title;
        books.findAll({
            where: {
                title:title
            }
        })
        .then(book => {
            // TODO update books response and send
            res.status(200).json({status:'success', messgae:'',book:book});
        })
        .catch(err => {
            console.log("error while get",err)
            res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
        })
    },
    getPublishedBooks: function(req,res){
        books.findAll({
            where: {
                is_published:1
            }
        })
        .then(books => {
            res.status(200).json({status:'success', messgae:'',books:books});
        })
        .catch(err => {
            console.log("error while get",err)
            res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
        })
    },
    getOwnPublishedBooks: function(req,res){
        books.findAll({
            where: {
                user_id: req.userId,
                is_published:1
            }
        })
        .then(books => {
            res.status(200).json({status:'success', messgae:'',books:books});
        })
        .catch(err => {
            console.log("error while get",err)
            res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
        })
    },
    getOwnUnpublishedBooks: function(req,res){
        books.findAll({
            where: {
                user_id: req.userId,
                is_published:0
            }
        })
        .then(books => {
            res.status(200).json({status:'success', messgae:'',books:books});
        })
        .catch(err => {
            console.log("error while get",err)
            res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
        })
    },
    publishBook: function(req,res){

        console.log("username",req.username)

        if(req.username.toLowerCase() === 'thanos'){
            res.status(403).json({status:"failed",error:"Security issue",messgae:"Thanos not able to publish book"})
        }

        let title = req.body.title;
        let description = req.body.description;
        let author  = req.body.author;
        let cover   = req.body.cover;
        let price   = req.body.price;
        let isPublished = 1;

        if(!title || title.trim() ==='' || !description || description.trim() ==='' || !author || author.trim() ==='' || !cover || cover.trim() ==='' || !price){
            res.status(500).json({status:'failed', messgae:'Missing parameters, Fill all parameters',payload:{"title":"title","description":"description","author":"author","cover":"cover","price":price}});
        }
        
        if(price === ""){
            price = 0;
        }

        let payload = {
            "title":title,
            "description":description,
            "author":author,
            "cover":cover,
            "price":price,
            "is_published":isPublished,
            "user_id":req.userId
        };

        books.create(payload)
        .then(data => {
            res.status(200).json({status:'success', messgae:'Book publish successfully',data:data});
        })
        .catch(err => {
            console.log("error post",err)
            res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
        })
    },
    unpublishBook: function(req,res){
        let title        = req.body.title;
        let isPublished = 0;
        if(!title || title.trim() ===''){
            res.status(500).json({status:'failed', messgae:'Missing parameters',payload:{"title":"title"}});
        }

        books.update(
            { is_published: isPublished },
            { where: { title: title,"user_id":req.userId } }
          )
            .then(() => {
              res.status(200).json({status:'success', messgae:'Book unpublish successfully'});
            })
            .catch(err => {
            console.log("error post",err)
            res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
        })
    },
    republishBook: function(req,res){
        let title        = req.body.title;
        let isPublished  = 1;
        if(!title || title.trim() ===''){
            res.status(500).json({status:'failed', messgae:'Missing parameters',payload:{"title":"title"}});
        }
        books.update(
            { is_published: isPublished },
            { where: { title: title,"user_id":req.userId } }
          )
            .then(() => {
              res.status(200).json({status:'success', messgae:'Book republish successfully'});
            })
            .catch(err => {
            console.log("error post",err)
            res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
        })
    }
};
