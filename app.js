
const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/masterclass')

const UserSchema = new mongoose.Schema({
  username: String
})

var User = mongoose.model('User', UserSchema)

const app = express()

app.get('/', (req, res) => {
  User.find().count((err, count) => {
    if (err) return res.status(500).send(err)
    return res.send({ count : count })
  })
})

app.get('/insert', (req, res) => {
  var user = new User({username: require('crypto').randomBytes(16).toString('hex')})
  user.save((err, _user) => {
    if (err) return res.status(500).send(err)
    return res.send(_user)
  })
})

app.get('/users', (req, res) => {
  User.find({}, (err, _users) => {
    if (err) return res.status(500).send(err)
    return res.send(_users)
  })
})

app.get('/throw', (req, res) => { throw new Error('Im a nasty exception') })
app.get('/drop', (req, res) => {
  User.remove({}, (err) => { if (err) return res.status(500).send(err); return res.send({success:true}) })
})

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))
