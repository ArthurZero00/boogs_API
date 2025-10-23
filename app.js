import express from "express";
import cors from "cors"
import fs from "fs/promises";
import {v4} from "uuid"
import {logger} from "./middlewares/logger.js";
import { validateBook } from "./middlewares/validationBook.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(express.static("public"));
//import path from "path";
//const DATA_FILE = path.join(process.cwd(), "data.json");
const DATA_FILE = "data.json"
const PORT = process.env.PORT || 3000;

//function for reading
async function readData(){
    try {
        const content = await fs.readFile(DATA_FILE, "utf8");
        return JSON.parse(content);
    }catch(err){
        if(err.code === ENOENT) return [];
        throw err;
    }
}
//function for writing
async function writeData(data){
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

//POST
app.post("/books", validateBook,async (req, res) => {
    const books = await readData();
    const newBook = {
        id: v4(),
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        year: req.body.year
    }

    books.push(newBook);
    await writeData(books);
    res.status(201).json({ success: "Book succefully added!"})
})
//GET
app.get("/books",async (req, res) => {
    const books = await readData();
    
    res.status(201).json(books);
    
})


//GET BY ID
app.get("/books/:id", async (req,res) => {
    const books = await readData();
    const id = req.params.id;
    const book = books.find(c => c.id === id);
    if(!book){
        return res.status(404).json({ error: "Book not found"});
    }
    res.status(201).json(book);
}
);

//UPDATE
app.put("/books", validateBook, async (req,res) => {
    const books = await readData();
    const index = books.findIndex(c => c.id === req.body.id);
    if(index === -1){
        return res.status(404).json({error: "Book not found"});
    }
    books[index].title = req.body.title.trim();
    books[index].author = req.body.author.trim();
    books[index].year = req.body.year;
    await writeData(books);
    res.status(201).json({ success: "Book successfully updated!"})
})


//DELETE
app.delete("/books/:id", async (req,res) => {
    const books = await readData();
    const id = req.params.id;
    const filtered = books.filter(c => c.id != id);
    if(books.length === filtered.length){
        res.status(404).json({ error:"Book not found!"});
    }
    await writeData(filtered);
    res.status(201).json({ success: "Book succesfully deleted!"});
    
})
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})