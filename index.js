const express = require('express');
const app = express();
let port = 8080;
let path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
    res.send("server working well");
});

// Dummy data
let posts = [
    {
        id: uuidv4(),
        username: "Apnacollege",
        content: "This is my first post"
    },
    {
        id: uuidv4(),
        username: "Risabhpant",
        content: "This is my second post"
    }
];

// Get all posts
app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

// New post form
app.get("/posts/new", (req, res) => {
    res.render("newpost.ejs");
});

// Create new post
app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
});

// Show a single post
app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
        res.render("show.ejs", { post });
});

// Edit post form
app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    if (post) {
        res.render("edit.ejs", { post });
    } else {
        res.send("Post not found");
    }
});

// Update post (PATCH)
app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let { content } = req.body;
    let post = posts.find((p) => p.id === id);
    if (post) {
        post.content = content;
        res.redirect("/posts");
    } else {
        res.send("Post not found");
    }
});

// Delete post
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.redirect("/posts");
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
