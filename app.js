
const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/masterclass', { useNewUrlParser: true })

var User = mongoose.model('User', new mongoose.Schema({
  username: String
}))

const app = express()

app.get('/', (req, res) => {
  User.countDocuments((err, count) => {
    if (err) return res.status(500).send(err)
    return res.send({ count : count })
  })
})

app.get('/insert', (req, res) => {
  var user = new User({username: require('crypto').randomBytes(16).toString('hex')})
  user.save((err, _user) => {
    if (err) return res.status(500).send(err)
    insert_min.mark()
    return res.send(_user)
  })
})

app.get('/users', (req, res) => {
  User.find({}, (err, _users) => {
    if (err) return res.status(500).send(err)
    return res.send(_users)
  })
})

app.get('/drop', (req, res) => {
  User.remove({}, (err) => {
    if (err) return res.status(500).send(err)
    return res.send({success:true})
  })
})

app.get('/throw', (req, res) => {
  throw new Error('Nasty error')
})

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))

/**
 * Process Metrics
 */
const io = require('@pm2/io')

var insert_min = io.meter('Insert/min')

var user_count = io.metric('User Count')

setInterval(function() {
  User.countDocuments({}, (err, count) => { user_count.set(count) })
}, 2000)

/**
 * Process Actions
 */
io.action('drop:users', function(reply) {
  User.remove({}, (err) => {
    return reply({success:true})
  })
})
