let express = require("express")
let session = require("express-session")
let path = require("path");
let http = require("http");
let https = require("https");
let parser = require("body-parser");
let multer = require("multer");
let fs = require("fs");


let tf_mod = require("./res/tf.js")


let storage = multer.memoryStorage();
let upload = multer({ storage: storage });


//let tf = require("@tensorflow/tfjs-node")

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
    let tempPath = '/home/rainmaker/Desktop/D2_website/temp/'
    // writting to temporary file
    fs.writeFile(tempPath+req.file.originalname, req.file.buffer, err=>{
        if(err) {
            console.log(err);
            return res.status(500).send("File write error");
        }
        tf_mod.test();
        let perc = tf_mod.preprocess_and_predict(tempPath+req.file.originalname);
        // deleting file
        fs.unlink(tempPath+req.file.originalname, err=>{
            if(err) {
                console.log(err);
                return res.status(500).send("File delete error");
            }
            res.status(200).send("File received");
            res.render('home.ejs', {percentage: perc?perc:0}, (err, html)=>{
                if(err) console.log(err);
                else console.log("Render ok");
            });
        });

    });
   
})

