require("dotenv").config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import mongoose, { mongo } from "mongoose";
import router from "./router/router";
import accountService from "./services/account-service";

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());
// app.use("/api", router);

// const start = async () => {
//     try {
//         app.listen(PORT, async () => {
//             console.log(`Server is started on ${PORT}`);
//         });
//     } catch (e) {
//         console.log(e);
//     }
// };

// start();

accountService.validateAccountNumber("DE75 5121 0800 1245 1261 99");
