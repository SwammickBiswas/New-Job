import { clerkMiddleware } from "@clerk/express";
import * as Sentry from "@sentry/node";
import cors from 'cors';
import "dotenv/config";
import express from 'express';
import connectCloudinary from "./config/cloudinary.js";
import connectDB from './config/db.js';
import "./config/instrument.js";
import { clerkWebHooks } from "./controller/webhooks.js";
import companyRoutes from "./routes/company.routes.js";
import jobsRoutes from "./routes/JobRoutes.js";
import userRoutes from "./routes/userRoutes.js";



const app = express()

await connectDB()
await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get("/", (req, res) => {
    res.send("Api is running")
})

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebHooks)
app.use("/api/company",companyRoutes)
app.use("/api/jobs",jobsRoutes)
app.use("/api/users",userRoutes)

const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})