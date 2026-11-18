import React, { useEffect, useState } from "react";

function Books() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({
        title: "",
        author: "",
        genre: "",
        isbn: "",
        quantity: 0
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    function loadBooks() {
        try {
            const savedBooks =
                JSON.parse(localStorage.getItem("lms_books")) || [];

            setBooks(savedBooks);
        } catch {
            setBooks([]);
        }
    }

    function saveBooks(data) {
        setBooks(data);
        localStorage.setItem("lms_books", JSON.stringify(data));
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function saveBook(e) {
        e.preventDefault();

        if (
            !form.title ||
            !form.author ||
            !form.genre ||
            !form.isbn
        ) {
            setMessage("Please fill in all book fields.");
            return;
        }

        const quantity = Number(form.quantity);

        if (quantity < 0) {
            setMessage("Quantity cannot be negative.");
            return;
        }

        if (editingId) {
            const updatedBooks = books.map(book =>
                book.id === editingId
                    ? {
                          ...book,
                          title: form.title,
                          author: form.author,
                          genre: form.genre,
                          isbn: form.isbn,
                          quantity: quantity
                      }
                    : book
            );

            saveBooks(updatedBooks);
            setMessage("Book updated successfully.");
        } else {
            const isbnExists = books.some(
                book => book.isbn === form.isbn
            );

            if (isbnExists) {
                setMessage("A book with this ISBN already exists.");
                return;
            }

            const newBook = {
                id: Date.now(),
                title: form.title,
                author: form.author,
                genre: form.genre,
                isbn: form.isbn,
                quantity: quantity
            };

            saveBooks([...books, newBook]);
            setMessage("Book added successfully.");
        }

        clearForm();
    }

    function editBook(book) {
        setForm({
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            quantity: book.quantity
        });

        setEditingId(book.id);
        setMessage("");
    }

    function deleteBook(id) {
        const updatedBooks = books.filter(
            book => book.id !== id
        );

        saveBooks(updatedBooks);
        setMessage("Book deleted successfully.");

        if (editingId === id) {
            clearForm();
        }
    }

    function clearForm() {
        setForm({
            title: "",
            author: "",
            genre: "",
            isbn: "",
            quantity: 0
        });

        setEditingId(null);
    }

    function addStock(book) {
        const updatedBooks = books.map(item =>
            item.id === book.id
                ? {
                      ...item,
                      quantity: Number(item.quantity) + 1
                  }
                : item
        );

        saveBooks(updatedBooks);
        setMessage("Stock added.");
    }

    function deductStock(book) {
        if (Number(book.quantity) <= 0) {
            setMessage("No copies available.");
            return;
        }

        const updatedBooks = books.map(item =>
            item.id === book.id
                ? {
                      ...item,
                      quantity: Number(item.quantity) - 1
                  }
                : item
        );

        saveBooks(updatedBooks);
        setMessage("Stock deducted.");
    }

    const filteredBooks = books.filter(book =>
        `${book.title} ${book.author} ${book.genre} ${book.isbn}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Book Management</h1>
                    <p>Add, update, delete and manage books.</p>
                </div>

                <button onClick={loadBooks}>Refresh</button>
            </div>

            <div className="card">
                <h2>
                    {editingId ? "Update Book" : "Add New Book"}
                </h2>

                <form onSubmit={saveBook}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Book Title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={form.author}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="genre"
                        placeholder="Genre"
                        value={form.genre}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="isbn"
                        placeholder="ISBN"
                        value={form.isbn}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="quantity"
                        min="0"
                        placeholder="Initial Quantity"
                        value={form.quantity}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        {editingId ? "Update Book" : "Add Book"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    )}
                </form>

                {message && (
                    <p className="message">
                        {message}
                    </p>
                )}
            </div>

            <div className="card">
                <div className="table-header">
                    <h2>Books</h2>

                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                {filteredBooks.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>ISBN</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBooks.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.quantity}</td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                addStock(book)
                                            }
                                        >
                                            + Stock
                                        </button>

                                        <button
                                            onClick={() =>
                                                deductStock(book)
                                            }
                                        >
                                            - Stock
                                        </button>

                                        <button
                                            onClick={() =>
                                                editBook(book)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteBook(book.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Books;