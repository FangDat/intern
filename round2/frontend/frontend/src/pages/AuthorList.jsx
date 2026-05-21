import React, {
    useEffect,
    useMemo,
    useState
} from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import updateIcon from "../assets/update.png";
import deleteIcon from "../assets/delete.png";
import api from "../api";


export default function AuthorList(){
    const navigate = useNavigate();
    const [authors, setAuthors] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const AUTHORS_PER_PAGE =5;
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

    const totalBooks = useMemo(() => { 
        return authors.reduce(
            (sum, author) => sum + author.books,
            0
        );
    }, [authors]);
    const totalPages = Math.ceil(
        authors.length / AUTHORS_PER_PAGE
    );
    const currentAuthors = useMemo(() =>{
        const startIndex =
        (currentPage - 1) * AUTHORS_PER_PAGE;

        const endIndex = 
        startIndex + AUTHORS_PER_PAGE;
        return authors.slice(startIndex, endIndex);

    }, [authors, currentPage]);

    const handleCreate = () => {
        navigate("/authors/create");
    };
    const handleEdit = (author) => {

        navigate(
            `/authors/update/${author.id}`
        );
    };

    const handleDelete = async () => {

        if (!deleteTarget) return;

        try {

            await api.delete(
                `/authors/${deleteTarget.id}`
            );

            const updatedAuthors =
                authors.filter(
                    (item) =>
                        item.id !== deleteTarget.id
                );

            setAuthors(updatedAuthors);

            const newTotalPages =
                Math.ceil(
                    updatedAuthors.length /
                    AUTHORS_PER_PAGE
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
                        Authors List
                    </h1>

                    <p className="page-subtitle">
                        Manage authors, view total books
                    </p>
                </div>
            </div>

            <div className="content-grid">
                <section className="table-card">
                    <div className="table-card__topline">
                        <div className="table-card__badge">
                            Authors
                        </div>
                        <div className="table-card__stats">
                            {totalBooks} books total
                        </div>
                    </div>

                    <div className="table-scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{width: 80}}>
                                        No
                                    </th>
                                    <th>
                                        Name
                                    </th>
                                    <th style={{ width: 120}}>
                                        Books
                                    </th>
                                    <th style={{ width: 170}}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentAuthors.map(
                                    (author, index) => (
                                        <tr key={author.id}>
                                            <td>
                                                {(currentPage - 1)*
                                                AUTHORS_PER_PAGE + 
                                                index +
                                                1}
                                            </td>

                                            <td className="table-name">
                                                {author.name}
                                            </td>
                                            <td>
                                                {author.books}
                                            </td>

                                            <td>
                                                <div className="actions-cell">
                                                    <button
                                                    type="button"
                                                    className="icon-btn"
                                                    onClick={() => 
                                                        handleEdit(author)
                
                                                    }
                                                    title="Update"
                                                    aria-label="Update author">
                                                        <img
                                                        src={updateIcon}
                                                        alt="Update"/>
                                                    </button>

                                                    <button
                                                    type="button"
                                                    className="icon-btn"
                                                    onClick={() =>
                                                        setDeleteTarget(author)
                                                    }
                                                    title="Delete"
                                                    aria-label="Delete author">

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
                                    {length: totalPages },
                                    (_, index) => {
                                        const page = index +1;

                                        return (
                                            <button
                                            key = {page}
                                            type= "button"
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
            title="Delete author?"
            message={
                deleteTarget
                ? `Do you want to delete "${deleteTarget.name}"? This action cannot be undone`
                :""
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

