const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(__dirname + "/views"));

const port = 8000;



// get "/"
app.get("/", (req, res) => {
    // res.json("Hello World");
    // console.log();

    const filePath = path.join(__dirname + "/views/index.html");
    // res.sendFile(path.join(__dirname + "/views/index.html"));

    res.sendFile(filePath, function(err) {
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
})
});
// get "/foods"
app.get("/foods", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/menu/menupage.html"));
});

// get "/cart"
app.get("/cart", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/viewcart/viewcart.html"));
});

// run on port 8000
app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
})

