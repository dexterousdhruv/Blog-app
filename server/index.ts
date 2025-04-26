import { config } from "dotenv";
import express from "express"
import authRouter from "./routes/auth.route";
import postRouter from "./routes/post.route";
const cors = require("cors")


const app = express();
const PORT = process.env.PORT || 3000;
config()

app.use(cors({
  origin: process.env.CLIENT_URL,
}))
app.use(express.json())
  

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)


app.listen(PORT, () => {
  console.log(`Yo! Server is running on port ${PORT} `)
}) 

     