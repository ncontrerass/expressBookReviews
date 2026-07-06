const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    // res.send(JSON.stringify(books,null,4));
    try {
        const allBooks = await new Promise((resolve, reject) => {
          if (books) {
            resolve(books);
          } else {
            reject(new Error("Data not available."));
          }
        });
    
        return res.status(200).json({
          total: Object.keys(allBooks).length,
          books: allBooks
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
     const isbn = req.params.isbn;
//   res.send(books[isbn]);

    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
             resolve(book);
        } else {
            reject(new Error(`Book with ISBN ${isbn} not found.`));
        }
    }).then(book => {
        return res.status(200).json({ isbn, book });
    }).catch(err => {
        return res.status(404).json({ message: err.message });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // const author = req.params.author;

    // const filteredData = Object.fromEntries(
    //     Object.entries(books).filter(([id, book]) => book.author === author)
    // );
      
    // res.send(JSON.stringify(filteredData,null,4));

    const searchAuthor = req.params.author.toLowerCase();

    new Promise((resolve, reject) => {
        const matchedBooks = {};
        for (const [isbn, book] of Object.entries(books)) {
            if (book.author.toLowerCase().includes(searchAuthor)) {
                matchedBooks[isbn] = book;
            }
        }

        if (Object.keys(matchedBooks).length > 0) {
            resolve(matchedBooks);
        } else {
            reject(new Error(`No books found for author: ${req.params.author}`));
        }
    }).then(matchedBooks => {
        return res.status(200).json({
            message: `Books by '${req.params.author}' retrieved successfully.`,
            books: matchedBooks
        });
    }).catch(err => {
        return res.status(404).json({ message: err.message });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // const title = req.params.title;

    // const filteredData = Object.fromEntries(
    //     Object.entries(books).filter(([id, book]) => book.title === title)
    // );
      
    // res.send(JSON.stringify(filteredData,null,4));

    const searchTitle = req.params.title.toLowerCase();

    new Promise((resolve, reject) => {
        const matchedBooks = {};
        for (const [isbn, book] of Object.entries(books)) {
            if (book.title.toLowerCase().includes(searchTitle)) 
            {
                matchedBooks[isbn] = book;
            }
        }
            if (Object.keys(matchedBooks).length > 0) 
            {
                resolve(matchedBooks);
            } 
            else {
                reject(new Error(`No books found with title: ${req.params.title}`));
            }
        }).then(matchedBooks => {
            return res.status(200).json({
                message: `Books with title '${req.params.title}' retrieved successfully.`,
                books: matchedBooks
            });
        }).catch(err => {
            return res.status(404).json({ message: err.message });
        });
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
