const express = require("express");
const colors = express("colors");
const connectDB = require("./config/db");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

require("dotenv").config();

connectDB();

const app = express();

//middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v1/goals", require("./routes/goalRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/tasks", require("./routes/taskRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));

// PORT=5500
// NODE_ENV=development
// MONGO_URI = mongodb+srv://maduvha:Mad.uvha12@cluster0.argfo.mongodb.net/yetuInvestments?retryWrites=true&w=majority
// JWT_SECRET = Mad.uvha12
