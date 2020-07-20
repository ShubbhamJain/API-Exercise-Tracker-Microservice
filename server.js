let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let helmet = require("helmet");
require("dotenv").config();

let app = express();

let PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
let db = mongoose.connection;
db.on("error", console.error.bind("MongoDB connection error"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/favicon.ico", (req, res) => res.status(200));

app.use("/new-user", require("./routes/users"));
app.use("/", require("./routes/users"));
app.use("/exercise/add", require('./routes/exercises'));
app.use("/", require("./routes/exercises"));

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});