import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../api";

export default function BookUpdate() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [title, setTitle] =
        useState("");

    const [author, setAuthor] =
        useState("");

    const [authors, setAuthors] =
        useState([]);

    const [errors, setErrors] =
        useState({
            title: "",
            author: "",
        });

    // =========================
    // FETCH DATA
    // =========================

    useEffect(() => {

        fetchAuthors();

        fetchBook();

    }, []);

    // =========================
    // FETCH AUTHORS
    // =========================

    const fetchAuthors = async () => {

        try {

            const response =
                await api.get("/authors");

            setAuthors(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    // =========================
    // FETCH BOOK
    // =========================

    const fetchBook = async () => {

        try {

            const response =
                await api.get("/books");

            const book =
                response.data.find(
                    (item) =>
                        item.id === Number(id)
                );

            if (book) {

                setTitle(book.title);

                // find author id

                const authorsResponse =
                    await api.get("/authors");

                const foundAuthor =
                    authorsResponse.data.find(
                        (item) =>
                            item.name === book.author
                    );

                if (foundAuthor) {

                    setAuthor(foundAuthor.id);

                }
            }

        } catch (error) {

            console.log(error);

        }
    };

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        let validationErrors = {
            title: "",
            author: "",
        };

        let isValid = true;

        // =========================
        // VALIDATE TITLE
        // =========================

        if (!title.trim()) {

            validationErrors.title =
                "Book title is required";

            isValid = false;
        }

        // =========================
        // VALIDATE AUTHOR
        // =========================

        if (!author) {

            validationErrors.author =
                "Author is required";

            isValid = false;
        }

        setErrors(validationErrors);

        if (!isValid) return;

        try {

            await api.put(
                `/books/${id}`,
                {
                    title: title,
                    author_id: Number(author),
                }
            );

            alert(
                "Book updated successfully!"
            );

            navigate("/books");

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div className="page-wrap">

            <div className="page-toolbar">

                <div>

                    <h1 className="page-title">
                        Update Book
                    </h1>

                    <p className="page-subtitle">
                        Update book information
                    </p>

                </div>

            </div>

            <div className="content-grid">

                <section className="table-card">

                    <form onSubmit={handleSubmit}>

                        {/* TITLE */}

                        <div className="form-group">

                            <label className="form-label">
                                Title
                            </label>

                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter book title"
                                value={title}
                                onChange={(e) => {

                                    setTitle(
                                        e.target.value
                                    );

                                    if (errors.title) {

                                        setErrors((prev) => ({
                                            ...prev,
                                            title: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.title && (

                                <p className="form-error">
                                    {errors.title}
                                </p>

                            )}

                        </div>

                        {/* AUTHOR */}

                        <div className="form-group">

                            <label className="form-label">
                                Author
                            </label>

                            <select
                                className="form-input"
                                value={author}
                                onChange={(e) => {

                                    setAuthor(
                                        e.target.value
                                    );

                                    if (errors.author) {

                                        setErrors((prev) => ({
                                            ...prev,
                                            author: "",
                                        }));
                                    }
                                }}
                            >

                                <option value="">
                                    Select author
                                </option>

                                {authors.map((item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>

                                ))}

                            </select>

                            {errors.author && (

                                <p className="form-error">
                                    {errors.author}
                                </p>

                            )}

                        </div>

                        {/* BUTTON */}

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