const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/write", (req, res) => {
  //DB에 저장하기
  //db.collection("post").insertOne({ title: "어쩌구" });
  res.render("write.ejs");
});

app.get("/list", async (req, res) => {
  let result = await db.collection("post").find().toArray();

  res.render("list.ejs", { posts: result });
});

app.get("/time", (req, res) => {
  let time = new Date();

  res.render("time.ejs", { servertime: time });
});

app.post("/add", async (req, res) => {
  try {
    if (req.body.title == "" || req.body.content == "") {
      res.send("제목 입력안함");
    } else {
      await db
        .collection("post")
        .insertOne({ title: req.body.title, content: req.body.content });
      res.redirect("/list");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("서버 에러");
  }
});
