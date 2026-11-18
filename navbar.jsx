import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("lms_current_user"));

    function logout() {
        localStorage.removeItem("lms_current_user");
        navigate("/users");
    }

    return (
        <nav className="navbar">
            <div className="nav-title">Starlight Library</div>

            <div className="nav-links">
                {user && (
                    <>
                        <Link to="/">Dashboard</Link>
                        <Link to="/books">Books</Link>
                        <Link to="/transactions">Transactions</Link>

                        {user.role === "Librarian" && (
                            <Link to="/users">Users</Link>
                        )}
                    </>
                )}

                {!user && <Link to="/users">Login</Link>}

                {user && (
                    <>
                        <span className="user-name">
                            {user.name} ({user.role})
                        </span>
                        <button onClick={logout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;