// script.js (frontend that matches your server's PUT /books)
const API_BASE = "http://localhost:3000"; // or '' if same origin

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookForm");
  const booksList = document.getElementById("books");
  const idInput = document.getElementById("bookId");
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");

  async function loadBooks() {
    const res = await fetch(`${API_BASE}/books`);
    const books = await res.json();
    booksList.innerHTML = "";
    books.forEach(b => {
      const li = document.createElement("li");
      li.textContent = `${b.title} by ${b.author} (${b.year})`;
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => fillForEdit(b);
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteBook(b.id);
      li.append(" ", editBtn, " ", delBtn);
      booksList.appendChild(li);
    });
  }

  function fillForEdit(book) {
    idInput.value = book.id;          // IMPORTANT: server expects id in body
    titleInput.value = book.title;
    authorInput.value = book.author;
    yearInput.value = book.year;
  }

  async function deleteBook(id) {
    await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });
    loadBooks();
  }

  form.onsubmit = async e => {
    e.preventDefault();
    const payload = {
      id: idInput.value || undefined,     // include id when updating
      title: titleInput.value,
      author: authorInput.value,
      year: Number(yearInput.value)
    };

    if (idInput.value) {
      // Match your server: PUT to /books with JSON body that includes id
      await fetch(`${API_BASE}/books`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    form.reset();
    idInput.value = "";
    loadBooks();
  };

  loadBooks();
});