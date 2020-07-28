const express = require('express')
const path = require('path')

const app = express()

//define config
const viewsPath = path.join(__dirname,'../templates/views')
const publicDir = path.join(__dirname, '../public')

//set up hbs
app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(publicDir))
app.use(express.json())



app.get('', (req, res)=>{
     res.render('index',{
         title:'Chat App'
     })
})

app.get('/chat', (req, res)=>{
    res.render('chat',{
        title:'Chat App'
    })
})

module.exports = app
