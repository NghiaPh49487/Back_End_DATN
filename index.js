import express from "express";
import cors from "cors";
import router from "./src/routers";
import connectDB from "./src/config/db";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB("mongodb://localhost:27017/database_DATN");

app.use("/api", router);

export { app };