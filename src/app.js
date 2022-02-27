const path = require('path')
const express = require('express')
require('./db/mongoose')
const {Admin, Inventory, User, Cart} = require('./db/mongoose')
const session = require('express-session')
const hbs = require('hbs')
const bodyparser = require('body-parser')
const async = require('hbs/lib/async')
const { request } = require('http')
const { captureRejectionSymbol } = require('events')
const libraryRouter = require('./routers/mart')
const adminRouter = require('./routers/admin')



const app = express()


//defining path for express config
const distPath = path.join(__dirname,'./templates/dist')
const viewsPath = path.join(__dirname, './templates/views')
const partialPath = path.join(__dirname, './templates/partials')

//setup handler engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

//setup static directory to serve
app.use(bodyparser.urlencoded({extended: false}))
app.use(express.static(distPath))

//setting up node to use session to authenticate user
app.use(session({
    secret: process.env.SESS_SECRET,
    cookie: { maxAge: ''},
    resave: true,
    saveUninitialized: true,
}))


app.use(adminRouter)
app.use(libraryRouter)

module.exports = app