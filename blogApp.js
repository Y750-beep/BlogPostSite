var bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();


mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true, useUnifiedTopology: true});
//app config
app.set("view engine", "ejs");
app.use(express.static("public"));    //so that we can server our custom style sheet
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



//Mongoose Model Config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}  //created should be a data and that date is set to now
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1594223223953-6a01dd617dc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
//     body:  " hello world this is hello world blog that we just created"
// 	});
//home route
app.get("/", function(req, res){  //it is conventional for sites, that their home page is the index page, so we will redirect here to home
	res.redirect("/blogs");
});
//index route
app.get("/blogs", function(req, res){    //this is the index page which is going to give us the list of all dogs
	Blog.find({}, function(err, blogs){//this is the data coming from db){
		if(err){
			console.log(err);
		}
		else{
				res.render("index", {blogs: blogs});

		}
	});
});
//new route
app.get("/blogs/new", function(req, res){
	res.render("new");
});
//create route
app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}
		else{
			//redirect somewhere
            res.redirect("/blogs");
		}
	});
});


app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show", {blog: foundBlog});
		}
	});
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id , function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){  //id, new , callback
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//delete route
app.delete("/blogs/:id", function(req, res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Server has been started");
});