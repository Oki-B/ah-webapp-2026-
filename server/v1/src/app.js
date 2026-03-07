require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const router = require('./routes/index')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.use(router)

app.listen(port, () => {
  console.log(`Express first initiation server running on port ${port}`)
})
