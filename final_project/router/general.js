const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ----------------------
// Promise helper methods
// ----------------------

// Returns all books as a Promise.
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

// Finds a book by ISBN.
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error(`No book found with ISBN: ${isbn}`));
    }
  });
};

// Returns all books written by the specified author.
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const result = Object.fromEntries(
      Object.entries(books).filter(([isbn, book]) =>
        book.author.toLowerCase().includes(author.toLowerCase())
      )
    );

    Object.keys(result).length
      ? resolve(result)
      : reject(new Error(`No book found for author: ${author}`));
    
  });
};

// Returns all books whose title matches the search term.
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const result = Object.fromEntries(
      Object.entries(books).filter(([isbn, book]) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      )
    );

    //result ? resolve(result) : reject("No books found by title");
    Object.keys(result).length
      ? resolve(result)
      : reject(new Error(`No book found matching title: ${title}`));
  });
};


// ---------- Routes ----------

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
       // Check if the user does not already exist
       if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user. Username or password is missing."});
});

// Task 10: Get the book list available in the shop
public_users.get('/', async function (req, res) {
    // res.send(JSON.stringify(books,null,4));
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    await getBookByISBN(isbn)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ message: error }));
 });
  
// Task 12: Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    // const author = req.params.author;

    // const filteredData = Object.fromEntries(
    //     Object.entries(books).filter(([id, book]) => book.author === author)
    // );
      
    // res.send(JSON.stringify(filteredData,null,4));

    try {
        const booksByAuthor = await getBooksByAuthor(req.params.author);
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 13: Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    // const title = req.params.title;

    // const filteredData = Object.fromEntries(
    //     Object.entries(books).filter(([id, book]) => book.title === title)
    // );
      
    // res.send(JSON.stringify(filteredData,null,4));

    const searchTitle = req.params.title;

    try {
        const booksByTitle = await getBooksByTitle(searchTitle);
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const reviews = books[isbn]?.reviews;

    if (!reviews) {
        return res.status(404).json({ message: "Book not found" });
    }

    const reviewCount = Object.keys(reviews).length;

    if (reviewCount === 0) {
        return res.status(200).json({ message: "No reviews found for this book." });
    }

    // return res.json(reviews);
    res.send(JSON.stringify(reviews,null,4))
});

module.exports.general = public_users;
