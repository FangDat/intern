import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import ConfirmDialog from "../components/ConfirmDialog";

import updateIcon from "../assets/update.png";
import deleteIcon from "../assets/delete.png";
import api from "../api";


export default function ReviewList() {
  const navigate = useNavigate();

    const [reviews, setReviews] =
        useState([]);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const REVIEWS_PER_PAGE = 5;

  useEffect(() => {
    fetchReviews();
    }, []);

    const fetchReviews = async () => {

    try {

        const response =
        await api.get("/reviews");

        setReviews(response.data);

    } catch (error) {

        console.log(error);
    }
    };

  const totalReviews = reviews.length;

  const totalPages = Math.ceil(
    reviews.length / REVIEWS_PER_PAGE
  );

  const currentReviews = useMemo(() => {
    const startIndex =
      (currentPage - 1) * REVIEWS_PER_PAGE;

    const endIndex =
      startIndex + REVIEWS_PER_PAGE;

    return reviews.slice(
      startIndex,
      endIndex
    );
  }, [reviews, currentPage]);

  const handleCreate = () => {
    navigate("/reviews/create");
  };

    const handleEdit = (review) => {
        navigate(
        `/reviews/update/${review.id}`
        );
    };

  const handleDelete = async () => {

  if (!deleteTarget) return;

  try {

    await api.delete(
      `/reviews/${deleteTarget.id}`
    );

    const updatedReviews =
      reviews.filter(
        (item) =>
          item.id !== deleteTarget.id
      );

    setReviews(updatedReviews);

    const newTotalPages =
      Math.ceil(
        updatedReviews.length /
        REVIEWS_PER_PAGE
      );

    if (currentPage > newTotalPages) {

      setCurrentPage(
        newTotalPages || 1
      );
    }

    setDeleteTarget(null);

  } catch (error) {

    console.log(error);
  }
};

  return (
    <div className="page-wrap">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">
            Reviews List
          </h1>

          <p className="page-subtitle">
            Manage book reviews
          </p>
        </div>
      </div>

      <div className="content-grid">
        <section className="table-card">
          <div className="table-card__topline">
            <div className="table-card__badge">
              Reviews
            </div>

            <div className="table-card__stats">
              {totalReviews} reviews total
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>
                    No
                  </th>

                  <th>Book</th>

                  <th style={{ width: 250 }}>
                    Author
                  </th>

                  <th style={{ width: 300 }}>
                    Review
                  </th>

                  <th style={{ width: 170 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentReviews.map(
                  (review, index) => (
                    <tr key={review.id}>
                      <td>
                        {(currentPage - 1) *
                          REVIEWS_PER_PAGE +
                          index +
                          1}
                      </td>

                      <td className="table-name">
                        {review.book}
                      </td>

                      <td>{review.author}</td>

                      <td>{review.review}</td>

                      <td>
                        <div className="actions-cell">
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() =>
                              handleEdit(review)
                            }
                            title="Update"
                          >
                            <img
                              src={updateIcon}
                              alt="Update"
                            />
                          </button>

                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() =>
                              setDeleteTarget(
                                review
                              )
                            }
                            title="Delete"
                          >
                            <img
                              src={deleteIcon}
                              alt="Delete"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            {Array.from(
              { length: totalPages },
              (_, index) => {
                const page = index + 1;

                return (
                  <button
                    key={page}
                    type="button"
                    className={`page-num ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                  >
                    {page}
                  </button>
                );
              }
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete review?"
        message={
          deleteTarget
            ? `Do you want to delete this review?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}