const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const { MongoClient } = require("mongodb");

let db;
const url =
  "mongodb+srv://seio9241:qwer1234@cluster0.b4b80ox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");

    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행 중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/news", (req, res) => {
  //DB에 저장하기
  //db.collection("post").insertOne({ title: "어쩌구" });
  res.send("뉴스");
});

app.get("/list", async (req, res) => {
  let result = await db.collection("post").find().toArray();

  res.render("list.ejs", { posts: result });
});

app.get("/time", (req, res) => {
  let time = new Date();

  res.render("time.ejs", { servertime: time });
});
