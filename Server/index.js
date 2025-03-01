const express = require("express");
require("./config/connectionDB");
const AuthApi = require("./apis/AuthApi");

const app = express();

app.use(express.json());

const PORT = 5500;



app.post("/", async (req, res, next) => {
  res.json({ message: "server is listening" });
});

app.use("/api/v1/auth", AuthApi);


app.all('*', (req, res, next) => {
    const error = new Error(`the url ${req.url} is not found`);
    next(error);
 })
 
 app.use((err, req, res, next) => {
     res.status(err.statusCode || 403).json({error: err.message})
 })
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port:${PORT}`);
});
