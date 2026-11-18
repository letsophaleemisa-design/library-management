import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const USERS_KEY = "lms_users";
const CURRENT_KEY = "lms_current_user";

const defaultUsers = [
    {
        id: 1,
        name: "System Administrator",
        membershipId: "ADMIN001",
        role: "Librarian",
        password: "admin123"
    }
];

function getUsers() {
    try {
        const saved = JSON.parse(localStorage.getItem(USERS_KEY));
        return saved && saved.length ? saved : defaultUsers;
    } catch {
        return defaultUsers;
    }
}

function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState(getUsers());
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem(CURRENT_KEY))
    );

    const [loginData, setLoginData] = useState({
        membershipId: "",
        password: ""
    });

    const [form, setForm] = useState({
        name: "",
        membershipId: "",
        role: "Student",
        password: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    function saveUsers(data) {
        setUsers(data);
        localStorage.setItem(USERS_KEY, JSON.stringify(data));
    }

    function login(e) {
        e.preventDefault();

        const found = users.find(
            user =>
                user.membershipId === loginData.membershipId &&
                user.password === loginData.password
        );

        if (!found) {
            setMessage("Invalid membership ID or password.");
            return;
        }

        localStorage.setItem(CURRENT_KEY, JSON.stringify(found));
        setCurrentUser(found);
        setMessage("Login successful.");

        setTimeout(() => {
            navigate("/");
        }, 500);
    }

    function logout() {
        localStorage.removeItem(CURRENT_KEY);
        setCurrentUser(null);
        setMessage("You have logged out.");
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function saveUser(e) {
        e.preventDefault();

        if (!form.name || !form.membershipId || !form.password) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (editingId) {
            const updated = users.map(user =>
                user.id === editingId
                    ? { ...user, ...form }
                    : user
            );

            saveUsers(updated);
            setMessage("User updated.");
        } else {
            const exists = users.some(
                user => user.membershipId === form.membershipId
            );

            if (exists) {
                setMessage("Membership ID already exists.");
                return;
            }

            const newUser = {
                id: Date.now(),
                ...form
            };

            saveUsers([...users, newUser]);
            setMessage("User added.");
        }

        setForm({
            name: "",
            membershipId: "",
            role: "Student",
            password: ""
        });

        setEditingId(null);
    }

    function editUser(user) {
        setForm({
            name: user.name,
            membershipId: user.membershipId,
            role: user.role,
            password: user.password
        });

        setEditingId(user.id);
        setMessage("");
    }

    function deleteUser(id) {
        if (currentUser && currentUser.id === id) {
            setMessage("You cannot delete the account currently logged in.");
            return;
        }

        const updated = users.filter(user => user.id !== id);
        saveUsers(updated);
        setMessage("User deleted.");
    }

    function cancelEdit() {
        setEditingId(null);

        setForm({
            name: "",
            membershipId: "",
            role: "Student",
            password: ""
        });
    }

    if (!currentUser) {
        return (
            <div className="page">
                <div className="login-box">
                    <h1>Starlight Library</h1>
                    <h2>Library Login</h2>

                    <form onSubmit={login}>
                        <input
                            type="text"
                            placeholder="Membership ID"
                            value={loginData.membershipId}
                            onChange={e =>
                                setLoginData({
                                    ...loginData,
                                    membershipId: e.target.value
                                })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={e =>
                                setLoginData({
                                    ...loginData,
                                    password: e.target.value
                                })
                            }
                        />

                        <button type="submit">Login</button>
                    </form>

                    <p>
                        Demo Login: <b>ADMIN001</b> / <b>admin123</b>
                    </p>

                    {message && <div className="message">{message}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p>
                        Logged in as {currentUser.name} ({currentUser.role})
                    </p>
                </div>

                <button onClick={logout}>Logout</button>
            </div>

            {currentUser.role === "Librarian" ? (
                <>
                    <div className="card">
                        <h2>
                            {editingId ? "Update User" : "Add User"}
                        </h2>

                        <form onSubmit={saveUser}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="membershipId"
                                placeholder="Membership ID"
                                value={form.membershipId}
                                onChange={handleChange}
                            />

                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="Student">Student</option>
                                <option value="Librarian">Librarian</option>
                            </select>

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                            />

                            <button type="submit">
                                {editingId ? "Update User" : "Add User"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    {message && (
                        <div className="message">
                            {message}
                        </div>
                    )}

                    <div className="card">
                        <h2>Registered Users</h2>

                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Membership ID</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.membershipId}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    editUser(user)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteUser(user.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="card">
                    <h2>Access Restricted</h2>
                    <p>
                        Only a librarian can manage library users.
                    </p>
                </div>
            )}
        </div>
    );
}

export default Users;