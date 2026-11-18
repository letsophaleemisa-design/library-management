import React, { useEffect, useState } from "react";

function Transactions() {
    const [books, setBooks] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [form, setForm] = useState({
        bookId: "",
        type: "Add",
        quantity: 1
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        try {
            const savedBooks =
                JSON.parse(localStorage.getItem("lms_books")) || [];

            const savedTransactions =
                JSON.parse(
                    localStorage.getItem("lms_transactions")
                ) || [];

            setBooks(savedBooks);
            setTransactions(savedTransactions);
        } catch {
            setBooks([]);
            setTransactions([]);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function saveTransaction(e) {
        e.preventDefault();

        const quantity = Number(form.quantity);

        if (!form.bookId || quantity < 1) {
            setMessage("Please select a book and enter a valid quantity.");
            return;
        }

        const book = books.find(
            book => String(book.id) === String(form.bookId)
        );

        if (!book) {
            setMessage("Book not found.");
            return;
        }

        if (
            form.type === "Deduct" &&
            Number(book.quantity) < quantity
        ) {
            setMessage("Not enough copies available.");
            return;
        }

        const newQuantity =
            form.type === "Add"
                ? Number(book.quantity) + quantity
                : Number(book.quantity) - quantity;

        const updatedBooks = books.map(book =>
            String(book.id) === String(form.bookId)
                ? {
                      ...book,
                      quantity: newQuantity
                  }
                : book
        );

        const currentUser = JSON.parse(
            localStorage.getItem("lms_current_user")
        );

        const newTransaction = {
            id: Date.now(),
            bookId: book.id,
            bookTitle: book.title,
            type: form.type,
            quantity: quantity,
            date: new Date().toLocaleString(),
            user: currentUser
                ? currentUser.name
                : "Unknown User"
        };

        const updatedTransactions = [
            newTransaction,
            ...transactions
        ];

        localStorage.setItem(
            "lms_books",
            JSON.stringify(updatedBooks)
        );

        localStorage.setItem(
            "lms_transactions",
            JSON.stringify(updatedTransactions)
        );

        setBooks(updatedBooks);
        setTransactions(updatedTransactions);

        setForm({
            bookId: "",
            type: "Add",
            quantity: 1
        });

        setMessage("Transaction completed successfully.");
    }

    function deleteTransaction(id) {
        const updated = transactions.filter(
            transaction => transaction.id !== id
        );

        setTransactions(updated);

        localStorage.setItem(
            "lms_transactions",
            JSON.stringify(updated)
        );

        setMessage("Transaction deleted.");
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Transactions</h1>
                    <p>Add or deduct book stock.</p>
                </div>

                <button onClick={loadData}>Refresh</button>
            </div>

            <div className="card">
                <h2>Stock Transaction</h2>

                <form onSubmit={saveTransaction}>
                    <select
                        name="bookId"
                        value={form.bookId}
                        onChange={handleChange}
                    >
                        <option value="">Select Book</option>

                        {books.map(book => (
                            <option
                                key={book.id}
                                value={book.id}
                            >
                                {book.title} - {book.quantity} copies
                            </option>
                        ))}
                    </select>

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="Add">Add Stock</option>
                        <option value="Deduct">Deduct Stock</option>
                    </select>

                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={form.quantity}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Save Transaction
                    </button>
                </form>

                {message && (
                    <p className="message">
                        {message}
                    </p>
                )}
            </div>

            <div className="card">
                <h2>Transaction History</h2>

                {transactions.length === 0 ? (
                    <p>No transactions recorded.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Date</th>
                                <th>User</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>
                                        {transaction.bookTitle}
                                    </td>

                                    <td>
                                        {transaction.type}
                                    </td>

                                    <td>
                                        {transaction.quantity}
                                    </td>

                                    <td>
                                        {transaction.date}
                                    </td>

                                    <td>
                                        {transaction.user}
                                    </td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                deleteTransaction(
                                                    transaction.id
                                                )
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

export default Transactions;