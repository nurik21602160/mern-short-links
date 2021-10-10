const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require('path')

const App = express()

App.use(express.json({entended: true}))
App.use('/api/auth', require('./routes/auth.routes'))
App.use('/api/link', require('./routes/link.routes'))
App.use('/t/', require('./routes/redirect.routes') )

if (process.env.NODE_ENV === 'production') {
    App.use('/', express.static(path.join(__dirname, 'client', 'build')))

    App.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('MongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        App.listen(PORT, () => {
            console.log(`server started on ${PORT} port...`)
        })
    } catch (e) {
        console.log('Server Error:', e.message)
        process.exit(1)
    }
}
start()

