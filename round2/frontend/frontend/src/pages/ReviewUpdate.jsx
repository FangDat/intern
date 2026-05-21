import React, {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../api";

export default function ReviewUpdate() {

    const navigate = useNavigate();

    const { id } = useParams();
    const [bookName, setBookName] =
    useState("");

const [authorName, setAuthorName] =
    useState("");


    const [review, setReview] =
        useState("");

    const [errors, setErrors] =
        useState({
            review: "",
        });

    useEffect(() => {
        fetchReview();
    }, []);



    const fetchReview = async () => {

        try {

            const response =
                await api.get("/reviews");

            const currentReview =
                response.data.find(
                    (item) =>
                        item.id === Number(id)
                );

            if (!currentReview) return;

            setReview(
                currentReview.review
            );

            setBookName(
                currentReview.book
            );

            setAuthorName(
                currentReview.author
            );

        } catch (error) {

            console.log(error);
        }
    };
const handleSubmit = async (e) => {

    e.preventDefault();

    let validationErrors = {
        review: "",
    };

    let isValid = true;

    if (!review.trim()) {

        validationErrors.review =
            "Review is required";

        isValid = false;
    }

    setErrors(validationErrors);

    if (!isValid) return;

    try {

        await api.put(
            `/reviews/${id}`,
            {
                review: review,
            }
        );

        alert(
            "Review updated successfully!"
        );

        navigate("/reviews");

    } catch (error) {

        console.log(error);
    }
};

    return (
        <div className="page-wrap">

            <div className="page-toolbar">

                <div>

                    <h1 className="page-title">
                        Update Review
                    </h1>

                    <p className="page-subtitle">
                        Update review information
                    </p>

                </div>

            </div>

            <div className="content-grid">

                <section className="table-card">

                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label className="form-label">
                                Book
                            </label>

                            <input
                                type="text"
                                className="form-input"
                                value={bookName}
                                disabled
                            />

                        </div>

                        <div className="form-group">

                            <label className="form-label">
                                Author
                            </label>

                            <input
                                type="text"
                                className="form-input"
                                value={authorName}
                                disabled
                            />

                        </div>

                        <div className="form-group">

                            <label className="form-label">
                                Review
                            </label>

                            <textarea
                                className="form-input"
                                rows="5"
                                placeholder="Enter review"
                                value={review}
                                onChange={(e) => {

                                    setReview(
                                        e.target.value
                                    );

                                    if (
                                        errors.review
                                    ) {

                                        setErrors(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,
                                                review:
                                                    "",
                                            })
                                        );
                                    }
                                }}
                            />

                            {errors.review && (
                                <p className="form-error">
                                    {
                                        errors.review
                                    }
                                </p>
                            )}

                        </div>

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