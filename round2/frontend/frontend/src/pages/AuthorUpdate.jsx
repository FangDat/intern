import React, { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../api";

export default function AuthorUpdate() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [name, setName] = useState("");

    const [books, setBooks] = useState("");

    const [nameError, setNameError] =
        useState("");

    const [booksError, setBooksError] =
        useState("");

    useEffect(() => {

        fetchAuthor();

    }, []);

    const fetchAuthor = async () => {

        try {

            const response =
                await api.get("/authors");

            const author =
                response.data.find(
                    (item) =>
                        item.id === Number(id)
                );

            if (author) {

                setName(author.name);

                setBooks(author.books);

            }

        } catch (error) {

            console.log(error);

        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        let isValid = true;

        setNameError("");

        setBooksError("");

        // =========================
        // VALIDATE NAME
        // =========================

        if (!name.trim()) {

            setNameError(
                "Author name is required"
            );

            isValid = false;
        }

        // =========================
        // VALIDATE BOOKS
        // =========================

        if (
            books === "" ||
            Number(books) < 0
        ) {

            setBooksError(
                "Books must be a positive number"
            );

            isValid = false;
        }

        if (!isValid) return;

        try {

            await api.put(
                `/authors/${id}`,
                {
                    name: name,
                    books: Number(books),
                }
            );

            alert(
                "Author updated successfully!"
            );

            navigate("/authors");

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div className="page-wrap">

            <div className="page-toolbar">

                <div>

                    <h1 className="page-title">
                        Update Author
                    </h1>

                    <p className="page-subtitle">
                        Update author information
                    </p>

                </div>

            </div>

            <div className="content-grid">

                <section className="table-card">

                    <form onSubmit={handleSubmit}>

                        {/* ========================= */}
                        {/* NAME */}
                        {/* ========================= */}

                        <div className="form-group">

                            <label className="form-label">
                                Name
                            </label>

                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter author name"
                                value={name}
                                onChange={(e) => {

                                    setName(
                                        e.target.value
                                    );

                                    if (nameError) {

                                        setNameError("");

                                    }
                                }}
                            />

                            {nameError && (

                                <p className="form-error">
                                    {nameError}
                                </p>

                            )}

                        </div>

                        {/* ========================= */}
                        {/* BOOKS */}
                        {/* ========================= */}

                        <div className="form-group">

                            <label className="form-label">
                                Books
                            </label>

                            <input
                                type="number"
                                className="form-input"
                                placeholder="Enter total books"
                                value={books}
                                onChange={(e) => {

                                    setBooks(
                                        e.target.value
                                    );

                                    if (booksError) {

                                        setBooksError("");

                                    }
                                }}
                            />

                            {booksError && (

                                <p className="form-error">
                                    {booksError}
                                </p>

                            )}

                        </div>

                        {/* ========================= */}
                        {/* BUTTON */}
                        {/* ========================= */}

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Update
                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </div>
    );
}