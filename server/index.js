//all server related file's. 


const express = require("express")
const app = express();
const userRoutes = require("./routes/User")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payment")
const profileRoutes = require("./routes/Profile")