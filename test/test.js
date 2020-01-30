var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server=require("../index");
let should = chai.should();
chai.use(chaiHttp);

describe ("CRUD OPERATIONS", function(){

    var book = {
            "title":"MARVEL 3",
            "description":"Marvel Endgame",
            "author":"Russo_brothers",
            "cover":"Avengers: Endgame",
            "price":700
    };

    var authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0bWUiLCJwYXNzd29yZCI6IiQyYiQxMCQvL1RQVi5rSGVjei5mSDdsM0lrWE5lMFJFbUlrNUdsdm5mbUdpbkh5ZWZzb2VUTjJHN2Q1MiIsImNyZWF0ZWRBdCI6IjIwMjAtMDEtMjlUMTU6MzE6MzYuMDAwWiIsImlhdCI6MTU4MDQwMTUwMywiZXhwIjoxNTgwNDE5NTAzfQ.5OkFdzJrIpKDeT33gKyaOxf1gbLNWp-W8lTCpXUTO-o';

    // PUBLISH BOOK
    it("Should publish Book", (done) => {
        chai.request(server)
            .post("/book/publish")
            .set('authorization', authToken)
            .send(book)
            .end((err, res) => {
                console.log("Should publish Book",err);
                res.should.have.status(200);
                console.log("Should publish Book");
            })
        done()
    })

    // GET ALL BOOKS
    it ("Should Fecth all the Books", (done)=>{
        chai.request(server)
            .get("/books/")
            .set('authorization', authToken)
            .end((err, result)=>{
                result.should.have.status(200);
                console.log ("Got",result, " docs")
                console.log ("Result Body:", result);
                done()
        })
    })

    it ("Should Search book by title", (done)=>{
        chai.request(server)
            .get("/book/serach?title=MARVEL")
            .set('authorization', authToken)
            .end((err, result)=>{                    
                result.should.have.status(200)
                console.log("Should Search book by title using /book/serach?title=MARVEL ::::", result.body)
                done()
            })
    })

    it ("Should Fetch publish Book only", (done)=>{
        chai.request(server)
            .get("/books/published")
            .set('authorization', authToken)
            .end((err, result)=>{                    
                result.should.have.status(200)
                console.log("Fetched publish Book using /GET/BOOKS/PUBLISHED::::", result.body)
                done()
            })
    })

    it ("Should Fetch own publish Book only", (done)=>{
        chai.request(server)
            .get("/books/own/publish")
            .set('authorization', authToken)
            .end((err, result)=>{                    
                result.should.have.status(200)
                console.log("Fetched publish Book using /books/own/publish::::", result.body)
                done()
            })
    })

    it ("Should Fetch own unpublish Book only", (done)=>{
        chai.request(server)
            .get("/books/own/unpublished")
            .set('authorization', authToken)
            .end((err, result)=>{                    
                result.should.have.status(200)
                console.log("Fetched publish Book using /books/own/unpublished::::", result.body)
                done()
            })
    })

    it ("Should Unpublish Book", (done)=>{
        var unpublishBook = {
            "title":"MARVEL"    
        }
        chai.request(server)
            .put("/book/unpublish")
            .set('authorization', authToken)
            .send(unpublishBook)
            .end((err, result)=>{                    
                result.should.have.status(200)
                console.log("Unpublish Book using /book/unpublish ::::", result.body)
                done()
        })
    })

    it ("Should Republish Book", (done)=>{
        var republishBook = {
            "title":"MARVEL"    
        }
        chai.request(server)
            .put("/book/republish")
            .set('authorization', authToken)
            .send(republishBook)
            .end((err, result)=>{                    
                result.should.have.status(200)
                console.log("Republish Book using /book/republish ::::", result.body)
                done()
        })
    })
    
})