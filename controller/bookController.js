const redis     = require('redis');
const books     = require('../models/books')
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client    = redis.createClient(REDIS_PORT);
const cacheTime = process.env.CACHETIME || 3600;  // seconds

// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
});

module.exports = {
    getBooks: function (req, res) {
        // key to store results in Redis store
        const booksRedisKey = 'books';
        return client.get(booksRedisKey, (err, booksResult) => {
            // If that key exists in Redis store
            if (booksResult) {
                return res.json({ status: 'success', messgae:'From Cache' ,data: JSON.parse(booksResult) })
            }else{
                books.findAll()
                .then(booksResult => {
                    // TODO update books response and send
                    // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
                    client.setex(booksRedisKey, cacheTime, JSON.stringify(booksResult))
                    res.status(200).json({status:'success', messgae:'',books:booksResult});
                })
                .catch(err => {
                    console.log("error while get",err)
                    res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
                })
            }
        })

    },
    serachBook: function(req,res){
        let title  = req.query.title;
        const searchBookKey = 'searchBook'+title;
        return client.get(searchBookKey, (err, bookResult) => {
            // If that key exists in Redis store
            if (bookResult) {
                return res.json({ status: 'success', messgae:'From Cache' ,data: JSON.parse(bookResult) })
            }else{
                books.findAll({
                    where: {
                        title:title
                    }
                })
                .then(bookResult => {
                    client.setex(searchBookKey, cacheTime, JSON.stringify(bookResult))
                    // TODO update books response and send
                    res.status(200).json({status:'success', messgae:'',book:bookResult});
                })
                .catch(err => {
                    console.log("error while get",err)
                    res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
                })
            }
        })
    },
    getPublishedBooks: function(req,res){
        const publishBooksKey = 'publishBooks';
        return client.get(publishBooksKey, (err, booksResult) => {
            // If that key exists in Redis store
            if (booksResult) {
                return res.json({ status: 'success', messgae:'From Cache' ,data: JSON.parse(booksResult) })
            }else{
                books.findAll({
                    where: {
                        is_published:1
                    }
                })
                .then(booksResult => {
                    client.setex(publishBooksKey, cacheTime, JSON.stringify(booksResult))
                    res.status(200).json({status:'success', messgae:'',books:booksResult});
                })
                .catch(err => {
                    console.log("error while get",err)
                    res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
                })
            }
        });
    },
    getOwnPublishedBooks: function(req,res){
        const ownPublishBookKey = 'ownPublishBook';
        return client.get(ownPublishBookKey, (err, booksResult) => {
            // If that key exists in Redis store
            if (booksResult) {
                return res.json({ status: 'success', messgae:'From Cache' ,data: JSON.parse(booksResult) })
            }else{
                books.findAll({
                    where: {
                        user_id: req.userId,
                        is_published:1
                    }
                })
                .then(booksResult => {
                    client.setex(ownPublishBookKey, cacheTime, JSON.stringify(booksResult))
                    res.status(200).json({status:'success', messgae:'',books:booksResult});
                })
                .catch(err => {
                    console.log("error while get",err)
                    res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
                })
            }
        })
    },
    getOwnUnpublishedBooks: function(req,res){
        const ownUnpublishBookKey = 'ownUnpublishBook';
        return client.get(ownUnpublishBookKey, (err, booksResult) => {
            // If that key exists in Redis store
            if (booksResult) {
                return res.json({ status: 'success', messgae:'From Cache' ,data: JSON.parse(booksResult) })
            }else{ 
                books.findAll({
                    where: {
                        user_id: req.userId,
                        is_published:0
                    }
                })
                .then(books => {
                    client.setex(ownUnpublishBookKey, cacheTime, JSON.stringify(booksResult))
                    res.status(200).json({status:'success', messgae:'',books:books});
                })
                .catch(err => {
                    console.log("error while get",err)
                    res.status(500).json({status:'failed', messgae:'Something wrong',error:err});
                })
            }
        });
    },
    publishBook: function(req,res){

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
