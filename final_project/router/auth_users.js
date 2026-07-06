const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Returns true if username does NOT already exist
const userExists = users.some(user => user.username === username);
return !userExists;
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Find the user with matching username AND password
const validUser = users.find(user =>
    user.username === username && user.password === password
  );
  return validUser !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            //data: password
            username
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        // req.session.authorization = {
        //     accessToken, username
        // }

        req.session.authorization = { accessToken };

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.query; 
    const username = req.user.username; 
  
    // Check book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review text is required as a query param: ?review=your+review" });
    }
  
    const isUpdate = !!books[isbn].reviews[username];
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: isUpdate
        ? `Review for ISBN ${isbn} updated successfully by '${username}'.`
        : `Review for ISBN ${isbn} added successfully by '${username}'.`,
      isbn,
      username,
      review
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
