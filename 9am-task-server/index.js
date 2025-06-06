const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./db.js");
const authRoutes = require("./routes/auth.js");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://9am-task.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", async (req, res) => {
  res.send(`9am task running`);
});
