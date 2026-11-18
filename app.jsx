import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./navbar";
import ProtectedRoute from "./PR";
import Dashboard from "./dashboard";
import Books from "./books";
import Transactions from "./transactions";
import Users from "./users";
import "./style.css";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/books"
                    element={
                        <ProtectedRoute>
                            <Books />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={<Users />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/users" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;