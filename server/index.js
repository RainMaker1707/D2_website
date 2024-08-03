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
        secure: false,
    }
});

app.use(express.static('static'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(parser.urlencoded({extended: true}));
app.use(middleware);

let server = https.createServer({
    key: fs.readFileSync('./server/cert/cert.key'),
    cert: fs.readFileSync('./server/cert/cert.crt')
}, app).listen(443);


http.createServer((req, res)=>{
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80);


app.get('/', (req, res)=>{
    res.render('home.ejs');
});


app.get('/answer', (req, res)=>{
    res.render('answer.ejs', {percentage: req.query.perc});
});


app.post('/upload', upload.single('file'), (req, res)=>{
    let tempPath = '/home/rainmaker/Desktop/D2_website/temp/'
    // writting to temporary file
    fs.writeFile(tempPath+req.file.originalname, req.file.buffer, err=>{
        if(err) {
            console.log(err);
            return res.status(500).send("File write error");
        }
        let perc = tf_mod.preprocess_and_predict(tempPath+req.file.originalname);
        // deleting file
        fs.unlink(tempPath+req.file.originalname, err=>{
            if(err) {
                console.log(err);
                return res.status(500).send("File delete error");
            }
            res.redirect(`/answer?perc=${perc}`);
        });
    });
})

