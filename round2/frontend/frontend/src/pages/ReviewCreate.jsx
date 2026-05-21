import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function ReviewCreate() {
  const navigate = useNavigate();

  const [review, setReview] = useState("");
  const [bookId, setBookId] = useState("");
  const [books, setBooks] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!bookId) {
      newErrors.book = "Book is required";
    }

    if (!review.trim()) {
      newErrors.review = "Review is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await api.post("/reviews", {
        book_id: Number(bookId),
        review: review,
      });

      alert("Review created successfully!");
      navigate("/reviews");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Create Review</h1>
          <p className="page-subtitle">Create a new review</p>
        </div>
      </div>

      <div className="content-grid">
        <section className="table-card">
          <form onSubmit={handleSubmit}>

            {/* REVIEW */}
            <div className="form-group">
              <label className="form-label">Review</label>

              <textarea
                className="form-input"
                rows={5}
                value={review}
                onChange={(e) => {
                  setReview(e.target.value);
                  if (errors.review) {
                    setErrors((prev) => ({
                      ...prev,
                      review: "",
                    }));
                  }
                }}
              />

              {errors.review && (
                <p className="form-error">{errors.review}</p>
              )}
            </div>

            {/* BOOK ONLY */}
            <div className="form-group">
              <label className="form-label">Book</label>

              <select
                className="form-input"
                value={bookId}
                onChange={(e) => {
                  setBookId(e.target.value);
                  if (errors.book) {
                    setErrors((prev) => ({
                      ...prev,
                      book: "",
                    }));
                  }
                }}
              >
                <option value="">Select a book</option>

                {books.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>

              {errors.book && (
                <p className="form-error">{errors.book}</p>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>

          </form>
        </section>
      </div>
    </div>
  );
}