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

// IBAN Country examples
// https://www.iban.com/structure

var accountNumber = "EE471000001020145685";
// accountNumber = "DE29100100100987654321";

accountService.validateAccountNumber(accountNumber).then((correct) => {
    console.log(accountNumber, correct);
});
