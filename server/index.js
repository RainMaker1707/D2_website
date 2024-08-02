const express = require("express")
const session = require("express-session")
const path = require("path");
const http = require("http");
const https = require("https");
const parser = require("body-parser");
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//const tf = require("@tensorflow/tfjs-node")

let app = express();

let middleware = session({
    secret: "not_s3cr3t_s3nt3nc3",
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000*60*60*24*7, //One week cookie lifetime
        secure: true,
    }
});

app.use(express.static('static'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(parser.urlencoded({extended: true}));
app.use(middleware);



let server = http.createServer({
}, app).listen(3000);



app.get('/', (req, res)=>{
    res.render('home.ejs');
});

app.post('/upload', upload.single('file'), (req, res)=>{
    console.log("received file");
    console.log(req.file)
})