const express = require("express");
const mysql = require("mysql2/promise");
const app = express();
const cors = require('cors')
app.use(express.json())
app.use(cors())
const port = 8000;
app.use(express.urlencoded({ extended: true }));

let conn = null;

const initMysql = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "openhouse",
    port: 3306,
  });
};

app.get("/fetch-game", async (req, res) => {
  try {
    let results = await conn.query("SELECT * FROM post");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ error: "Error fetching post" });
  }
});

app.get("/fetch-game/:id", async (req, res) => {
    try {
        if(req.params.id === '5'){
            let results = await conn.query("SELECT * FROM post");
            res.json(results[0]);
        }else{
            let results = await conn.query("SELECT * FROM post WHERE category_id = ?", [req.params.id]);
            res.json(results[0]);
        }
    } catch (error) {
      console.error("Error fetching post from category:", error.message);
      res.status(500).json({ error: "Error fetching post from category" });
    }
  });

app.post("/post-game", async (req, res) => {
  const data = req.body;
    console.log(data)
  try {
    await conn.query("INSERT INTO post SET ?", data);
    res.json({ message: "Post created" });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Error creating post" });
  }
});

app.get("/post-game/:id", async(req, res) => {
    const post_id = req.params.id;

    try{
        let results = await conn.query("SELECT * FROM post WHERE id = ?", [post_id]);
        if(results[0].length === 0){
            res.status(404).json({error: "Post not found"});
        }
        res.json(results[0]);
    }catch(error){
        console.error("Error fetching post:", error.message);
        res.status(500).json({error: "Error fetching post"});
    }
});

app.post("/bidding-game/:id", async(req, res) => {
    const post_id = req.params.id;
    const data = req.body;

    try{
        await conn.query("INSERT INTO bidding SET ?", data);
    }catch(error){
        console.error("Error create bidding:", error.message);
        res.status(500).json({error: "Error create bidding"});
    }
});

app.post("/post-game/:id/contact", async(req, res) => {
    const data = req.body;

    try{
        await conn.query("INSERT INTO contact SET ?", data);
    }catch{
        console.error("Error create contact:", error.message);
        res.status(500).json({error: "Error create contact"});
    }
});

app.get("/bidding-game/:id", async(req, res) => {
    const post_id = req.params.id;

    try{
        let results = await conn.query("SELECT * FROM bidding WHERE post_id = ? ORDER BY bid_price DESC", [post_id]);
        res.json(results[0]);
    }catch{
        console.error("Error fetching bidding:", error.message);
        res.status(500).json({error: "Error fetching bidding"});
    }
})

app.listen(port, async() => {
  await initMysql();
  console.log(`Server is running on port ${port}`);
});
