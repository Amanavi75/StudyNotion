//all server related file's. 


const express = require("express")
const app = express();
const userRoutes = require("./routes/User")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payment")
const profileRoutes = require("./routes/Profile");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const {cloudinaryConnect} = require("./config/cloudinary")