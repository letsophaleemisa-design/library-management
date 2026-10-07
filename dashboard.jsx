import React, { useEffect, useState } from "react";

function Dashboard() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        loadBooks();
    }, []);

    function loadBooks() {
        try {
            const savedBooks = JSON.parse(
                localStorage.getItem("lms_books")
            );

            setBooks(savedBooks || []);
        } catch {
            setBooks([]);
        }
    }

    const lowStockBooks = books.filter(
        book => Number(book.quantity) < 2
    );

    const totalBooks = books.reduce(
        (total, book) => total + Number(book.quantity || 0),
        0
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Starlight Library Management System</p>
                </div>

                <button onClick={loadBooks}>Refresh</button>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <h3>Book Titles</h3>
                    <p>{books.length}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Copies</h3>
                    <p>{totalBooks}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Low Stock</h3>
                    <p>{lowStockBooks.length}</p>
                </div>
            </div>

            <div className="card">
                <h2>Low Stock Books</h2>
                <p>Books with fewer than 2 copies available.</p>

                {lowStockBooks.length === 0 ? (
                    <p>No low-stock books.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>ISBN</th>
                                <th>Available Copies</th>
                            </tr>
                        </thead>

                        <tbody>
                            {lowStockBooks.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Dashboard;