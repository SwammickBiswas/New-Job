import * as Sentry from "@sentry/node";
import cors from 'cors';
import "dotenv/config";
import express from 'express';
import connectDB from './config/db.js';
import "./config/instrument.js";
import { clerkWebHooks } from "./controllers/webhooks.js";

const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
app.post("/webhooks",clerkWebHooks)
  

const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
}) 