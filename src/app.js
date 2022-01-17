const cors = require('cors')
const express = require('express')
const userRouter = require('./routers/user')
const { PORT } = require('../config/index')
const morganMiddleware = require('./middlewares/morgan')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morganMiddleware)

app.use(userRouter)

app.get('/health', (req, res) => {
    res.json({
      status: true,
      msg:'App is running fine!'
  })
})

app.listen(PORT, ()=>{
    console.log('Server is up on port ' + PORT)
})

