const axios = require("axios");

const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using async/await with Axios
async function getAllBooks() {
    const response = await axios.get(`${BASE_URL}/`);
    console.log(response.data);
}

// Task 11: Get book by ISBN using Promise callbacks with Axios
function getBookByISBN(isbn) {
    axios
        .get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => console.log(response.data))
        .catch(error => console.error(error.message));
}

// Task 12: Get books by author using async/await with Axios
async function getBooksByAuthor(author) {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    console.log(response.data);
}

// Task 13: Get books by title using async/await with Axios
async function getBooksByTitle(title) {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    console.log(response.data);
}

// Example test calls
getAllBooks();
getBookByISBN("1");
getBooksByAuthor("Homer");
getBooksByTitle("The Iliad");
