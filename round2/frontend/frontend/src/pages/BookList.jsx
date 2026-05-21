import React, { useEffect ,useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmDialog from "../components/ConfirmDialog";

import updateIcon from "../assets/update.png";
import deleteIcon from "../assets/delete.png";
import api from "../api";


export default function BookList() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const BOOKS_PER_PAGE = 5;
  useEffect(() => {
    fetchBooks();
  }, []);
  const fetchBooks = async () => {
    try{
        const response =
            await api.get("/books");
        
        setBooks(response.data);
    } catch (error) {
        console.log(error);
    }
  };

  const totalBooks = books.length;

  const totalPages = Math.ceil(
    books.length / BOOKS_PER_PAGE
  );

  const currentBooks = useMemo(() => {
    const startIndex =
      (currentPage - 1) * BOOKS_PER_PAGE;

    const endIndex =
      startIndex + BOOKS_PER_PAGE;

    return books.slice(startIndex, endIndex);
  }, [books, currentPage]);

  const handleCreate = () => {
    navigate("/books/create");
  };

    const handleEdit = (book) => {

        navigate(
            `/books/update/${book.id}`
        );
    };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
        await api.delete(
            `/books/${deleteTarget.id}`
        );
        const updateBooks = 
            books.filter(
                (item) =>
                    item.id !== deleteTarget.id
            );
        
        setBooks(updateBooks);

        const newTotalPages = 
            Math.ceil(
                updateBooks.length /
                BOOKS_PER_PAGE
            );
        if ( currentPage > newTotalPages){
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
            Books List
          </h1>

          <p className="page-subtitle">
            Manage books and authors
          </p>
        </div>
      </div>

      <div className="content-grid">
        <section className="table-card">
          <div className="table-card__topline">
            <div className="table-card__badge">
              Books
            </div>

            <div className="table-card__stats">
              {totalBooks} books total
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>
                    No
                  </th>

                  <th>Title</th>

                  <th style={{ width: 250 }}>
                    Author
                  </th>

                  <th style={{ width: 170 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentBooks.map(
                  (book, index) => (
                    <tr key={book.id}>
                      <td>
                        {(currentPage - 1) *
                          BOOKS_PER_PAGE +
                          index +
                          1}
                      </td>

                      <td className="table-name">
                        {book.title}
                      </td>

                      <td>{book.author}</td>

                      <td>
                        <div className="actions-cell">
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() =>
                              handleEdit(book)
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
                              setDeleteTarget(book)
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
        title="Delete book?"
        message={
          deleteTarget
            ? `Do you want to delete "${deleteTarget.title}"?`
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