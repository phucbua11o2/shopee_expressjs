const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const paypal = require('paypal-rest-sdk');
const stripe =require('stripe')('');
const flash = require('connect-flash');
const YOUR_DOMAIN = 'http://localhost:3000/';
const express_handlebars_sections = require('express-handlebars-sections');
const app = express();
const port = process.env.PORT ||3000;

const route = require('./routes');

const db = require('./config/db');

//proxy
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/shopee_dev' }),
  cookie: { 
     // secure: true 
    }
}))
//flash
app.use(flash());
//Config paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AeIFTiQkCVpN2UUlXozMmr9OC0nMojrxTGVIaMWVBhujuoFPapt-mIOkkoXffONNtJ16SXMVDTn25BNl',
    'client_secret': 'ED01573Bo5iyIU2eZ4yamfYJET_7YNkKvtRYB9D9qV2FDOqgKReU7tiDN_9kApsnYLLu0gflonvduKp3'
  });
  
//Connect Database
db.connect();
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
})
app.use(
    express.urlencoded({
        extended: true,
    }),
);
//HTTP logger
//app.use(morgan('combined'))
require('./middlewares/locals.mdw')(app);
//middelware
app.use(express.json());
app.use(methodOverride('_method'));
//Template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            section: express_handlebars_sections() ,
            sum: (a, b) => a + b,
        },
    }),
);



app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Routes init
route(app);

app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`),
);
