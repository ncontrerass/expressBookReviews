const axios = require("axios");

const BASE_URL = "http://localhost:5000";

async function getAllBooks() {
  const response = await axios.get(`${BASE_URL}/`);
  console.log(response.data);
}

function getBookByISBN(isbn) {
  axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => console.log(response.data))
    .catch(error => console.log(error.message));
}

async function getBooksByAuthor(author) {
  const response = await axios.get(`${BASE_URL}/author/${author}`);
  console.log(response.data);
}

async function getBooksByTitle(title) {
  const response = await axios.get(`${BASE_URL}/title/${title}`);
  console.log(response.data);
}
