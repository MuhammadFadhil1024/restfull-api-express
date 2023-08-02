require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 9000
const router = require('./routes')
const env = process.env.NODE_ENV

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(router)

if (env !== 'test') {
    app.listen(PORT, () => {
        console.log('App running on port: ', PORT)
    })
}

module.exports = app
