import React, { useEffect ,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function BookCreate() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [authors, setAuthors] = useState([]);


    const [errors, setErrors] = useState({
        title: "",
        author: "",
    });

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response =
            await api.get("/authors");

            setAuthors(response.data);
        } catch (error) {
            console.log(error);
        }
        
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        let validationErrors = {
            title: "",
            author: "",
        };

        let isValid = true;

        if (!title.trim()) {
            validationErrors.title =
                "Book title is required";

            isValid = false;
        }

        if (!author) {
            validationErrors.author =
                "Author is required";

            isValid = false;
        }

        setErrors(validationErrors);

        if (!isValid) return;

        try {
            await api.post("/books", {
                title: title,
                author_id: Number(author),
            });

            alert(
                "Book created"
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
                        Create Book
                    </h1>

                    <p className="page-subtitle">
                        Create a new book
                    </p>
                </div>
            </div>

            <div className="content-grid">

                <section className="table-card">

                    <form onSubmit={handleSubmit}>

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

                                    setTitle(e.target.value);

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

                        <div className="form-group">

                            <label className="form-label">
                                Author
                            </label>

                            <select
                                className="form-input"
                                value={author}
                                onChange={(e) => {

                                    setAuthor(e.target.value);

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
                                    key = {item.id}
                                    value={item.id}>
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

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Create
                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </div>
    );
}