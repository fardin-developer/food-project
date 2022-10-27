const express = require('express');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
var session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');

app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

var cartArray = []

let url = "mongodb://127.0.0.1/pizza";
//database connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "MongoDB connection error:"));

const Schema = mongoose.Schema;
const menuSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true }
})

const Menu = mongoose.model("Menu", menuSchema)



//session store


//config  session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/pizza', collection: "sessions" }),
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }//24 hours
}))

//flash session
app.use(flash());


app.get('/', (req, res) => {
    Menu.find().then((pizzas) => {
        res.render('home', {
            pizzas: pizzas
        })
    })
});

app.get('/cart', (req, res) => {
    const pizzaData = req.session.cart
    res.render('cart', { pizzaData: pizzaData })
});

app.post('/update-cart', (req, res) => {
    if (req.session.cart?.length > 0) {
        cartArray = req.session.cart;
    }
    if (cartArray.findIndex(e => e._id === req.body._id) >= 0) {
        const index = cartArray.findIndex(e => e._id === req.body._id);
        cartArray[index] = { ...cartArray[index], qty: cartArray[index].qty + 1 }
    }
    else {
        cartArray.push({ ...req.body, qty: 1 })
    }
    req.session.cart = cartArray
    console.log(req.session.cart)

















    // if (!req.session.cart) {
    // }else if (req.session.cart.id==req.body._id) {
    //     req.session.cart={
    //         id:req.body._id,
    //         qty:req.session.cart.qty +1,
    //         totalQty :req.session.cart.totalQty+ 1,
    //         totalPrice : 0
    //     }
    //  }else if(req.session.cart.qty>1){
    //     req.session.cart={
    //         id:req.body._id,
    //         qty:req.session.cart.qty +1,
    //         totalQty :req.session.cart.totalQty+ 1,
    //         totalPrice : 0
    //     }
    // }











    // pizzaData = req.body;
    // if (!req.session.cart) {
    //     req.session.cart={
    //         items:{},
    //         totalQty : 0,
    //         totalPrice : 0
    //     }
    // } 
    // var cart = req.session.cart;
    // if (!cart.items[req.body._id]) {
    //     cart.items[req.body._id] = {
    //         item: req.body,
    //         qty:1
    //     }
    //     cart.totalQty = cart.totalQty+1;
    //     cart.totalPrice = cart.totalPrice+req.body.price;
    // }
    // else{
    //     cart.items.req.body._id.qty = cart.items.req.body._id.qty+1;
    //     cart.totalPrice = cart.totalPrice + req.body.price;
    // }









    /////////////////////////to find total quantity/////////////////////////
    // else {
    //     req.session.cart={
    //         tqty : req.session.cart.tqty +1
    //     }
    // }

    //  console.log(req.session.cart.qty);





    res.redirect('cart')

});


// PORT = process.env || 3000
app.listen(3000, () => {
    console.log(`Server running at port 3000`);
})