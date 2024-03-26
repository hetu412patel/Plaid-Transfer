const express = require("express")
const cors = require("cors")

const dotenv = require("dotenv");
dotenv.config();

const transferRoute = require('./router/routes')

const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())

app.use(transferRoute)

app.listen(port, ()=>{
    console.log(`connection is setup at port ${port}`);
})  