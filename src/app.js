const cors = require('cors')
const express = require('express')
const userRouter = require('./routers/user')
const morganMiddleware = require('./middlewares/morgan')

let PORT = process.env.PORT || 3000 

const app = express()

app.use(express.json())
app.use(cors())
app.use(morganMiddleware)

app.get('/favicon.ico', ( req, res )=> {
  res.redirect('/health')
})

app.get('/health', (req, res) => {
    res.json({
      status: true,
      msg:'App is running fine!'
  })
})

app.use(userRouter)


app.listen(PORT, ()=>{
    console.log('Server is up on port ' + PORT)
})

