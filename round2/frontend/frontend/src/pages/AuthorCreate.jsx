import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
export default function AuthorCreate() {
    const navigate = useNavigate();


    const [name, setName] = useState("");


    const [error, setError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!name.trim()) {

            setError(
                "Author name is required"
            );

            return;
        }

        setError("");

        try {

            await api.post("/authors", {
                name: name,
            });

            alert(
                "Author created successfully!"
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
                        Create Author
                    </h1>

                    <p className="page-subtitle">
                        Create a new author
                    </p>
                </div>
            </div>

            <div className="content-grid">
                <section className="table-card">
                    <form onSubmit={handleSubmit}>


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
                                    setName(e.target.value);

                                   
                                    if (error) {
                                        setError("");
                                    }
                                }}
                            />


                            {error && (
                                <p className="form-error">
                                    {error}
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