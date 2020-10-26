const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const pino = require('express-pino-logger')()
const { videoToken } = require('./tokens')
const Twilio = require('twilio')

const app = express()
const client = new Twilio(
  process.env.TWILIO_API_KEY,
  process.env.TWILIO_API_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(pino)

const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json')
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  )
}

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World'
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }))
})

app.get('/complete/:roomSid', async (req, res) => {
  const { roomSid } = req.params
  try {
    await client.video.rooms(roomSid).update({ status: 'completed' })
    res.status(200).end()
  } catch (error) {
    console.error(error.stack)
    res.status(500).send(error)
  }
})

app.get('/video/token', (req, res) => {
  const identity = req.query.identity
  const room = req.query.room
  const token = videoToken(identity, room, config)
  sendTokenResponse(token, res)
})
app.post('/video/token', (req, res) => {
  const identity = req.body.identity
  const room = req.body.room
  const token = videoToken(identity, room, config)
  sendTokenResponse(token, res)
})

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
)
