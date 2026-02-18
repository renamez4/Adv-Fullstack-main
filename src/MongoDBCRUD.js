const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect(
    "mongodb://admin:FYBzyh31871@node86043-env-advcompro.proen.app.ruk-com.cloud:11754",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

);


const Book = mongoose.model("Book", {
    id: {
        type: Number,
        unique: true,
        required: true
    },
    title: String,
    author: String,
});

const app = express();
app.use(express.json());

app.post("/books", async (req, res) => {
    try {
        const lastBook = await Book.findOne().sort({ id: -1 });
        const nextId = lastBook ? lastBook.id + 1 : 1;

        const book = new Book({
            id: nextId,
            ...req.body,
        });
        await book.save();
        res.send(book);
    } catch (error) {
        res.status(500).send("Error creating book");
    }
});

app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.send(books);
    } catch (error) {
        res.status(500).send("Error retrieving books");
    }
});

app.get("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOne({ id: req.params.id });
        res.send(book);
    } catch (error) {
        res.status(500).send("Error retrieving book");
    }
});

app.put("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.send(book);
    } catch (error) {
        res.status(500).send("Error updating book");
    }
});

app.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ id: req.params.id });
        res.send(book);
    } catch (error) {
        res.status(500).send("Error deleting book");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}...`);
});