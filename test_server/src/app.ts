const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 666

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.get('/test_timeout/', (_request: any, response: any) => {
  setTimeout(() => {
    response.json('ok')
  }, 20000)
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
