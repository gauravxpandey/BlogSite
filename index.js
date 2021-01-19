var express = require("express");
var app = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 8080;

//APP config
mongoose.connect("mongodb://localhost:27017 /blog_app", {
    useNewUrlParser: true, useUnifiedTopology: true
});  

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");



//MONGOOSE config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);



app.get("/", function(req, res) {
    res.redirect("/blogs");
});


//ROUTE

app.get("/blogs", function (req, res) {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("err!");
        }else {
            res.render("index", {blogs:blogs});
        }
    });   
});



//Create ROUTE
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if (err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/new", function (req, res) {
    res.render("newpost");
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
});


 //EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("ERROR!")
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
        if(err){
            console.log("ERR!")
        }  else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

app.listen(port, function () {
    console.log(" BlogSite server is started");
});