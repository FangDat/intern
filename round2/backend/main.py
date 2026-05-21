from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import psycopg2
from psycopg2.extras import RealDictCursor

from dotenv import load_dotenv

import os

# =========================
# LOAD ENV
# =========================

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# =========================
# CONNECT DATABASE
# =========================

connection = psycopg2.connect(
    DATABASE_URL,
    cursor_factory=RealDictCursor
)

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "Backend is running"
    }

# ====================================================
# AUTHORS APIs
# ====================================================

@app.get("/authors")
def get_authors():

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM authors
        ORDER BY id ASC
    """)

    authors = cursor.fetchall()

    cursor.close()

    return authors


@app.post("/authors")
def create_author(data: dict):

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO authors (name, books)
        VALUES (%s, %s)
        RETURNING *
    """, (
        data["name"],
        0
    ))

    new_author = cursor.fetchone()

    connection.commit()

    cursor.close()

    return {
        "message": "Author created",
        "data": new_author
    }


@app.put("/authors/{id}")
def update_author(id: int, data: dict):

    cursor = connection.cursor()

    cursor.execute("""
        UPDATE authors
        SET
            name = %s,
            books = %s
        WHERE id = %s
        RETURNING *
    """, (
        data["name"],
        data["books"],
        id
    ))

    updated_author = cursor.fetchone()

    connection.commit()

    cursor.close()

    return {
        "message": "Author updated",
        "data": updated_author
    }


@app.delete("/authors/{id}")
def delete_author(id: int):

    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM authors
        WHERE id = %s
    """, (id,))

    connection.commit()

    cursor.close()

    return {
        "message": "Author deleted"
    }

# ====================================================
# BOOKS APIs
# ====================================================

@app.get("/books")
def get_books():

    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            books.id,
            books.title,
            authors.name AS author
        FROM books
        JOIN authors
        ON books.author_id = authors.id
        ORDER BY books.id ASC
    """)

    books = cursor.fetchall()

    cursor.close()

    return books



@app.post("/books")
def create_book(data: dict):

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO books (
            title,
            author_id
        )
        VALUES (%s, %s)
        RETURNING *
    """, (
        data["title"],
        data["author_id"]
    ))

    new_book = cursor.fetchone()

    cursor.execute("""
        UPDATE authors
        SET books = books + 1
        WHERE id = %s
    """, (data["author_id"],))

    connection.commit()

    cursor.close()

    return {
        "message": "Book created",
        "data": new_book
    }

@app.put("/books/{id}")
def update_book(id: int, data: dict):

    cursor = connection.cursor()

    # =========================
    # GET OLD BOOK
    # =========================

    cursor.execute("""
        SELECT author_id
        FROM books
        WHERE id = %s
    """, (id,))

    old_book = cursor.fetchone()

    if not old_book:

        cursor.close()

        return {
            "message": "Book not found"
        }

    old_author_id = old_book["author_id"]

    # =========================
    # UPDATE BOOK
    # =========================

    cursor.execute("""
        UPDATE books
        SET
            title = %s,
            author_id = %s
        WHERE id = %s
        RETURNING *
    """, (
        data["title"],
        data["author_id"],
        id
    ))

    updated_book = cursor.fetchone()

    # =========================
    # IF AUTHOR CHANGED
    # UPDATE BOOK COUNTS
    # =========================

    if old_author_id != data["author_id"]:

        # decrease old author

        cursor.execute("""
            UPDATE authors
            SET books = books - 1
            WHERE id = %s
        """, (old_author_id,))

        # increase new author

        cursor.execute("""
            UPDATE authors
            SET books = books + 1
            WHERE id = %s
        """, (data["author_id"],))

    connection.commit()

    cursor.close()

    return {
        "message": "Book updated",
        "data": updated_book
    }
@app.delete("/books/{id}")
def delete_book(id: int):

    cursor = connection.cursor()

    # =========================
    # GET AUTHOR ID
    # =========================

    cursor.execute("""
        SELECT author_id
        FROM books
        WHERE id = %s
    """, (id,))

    book = cursor.fetchone()

    if not book:

        cursor.close()

        return {
            "message": "Book not found"
        }

    # =========================
    # DELETE BOOK
    # =========================

    cursor.execute("""
        DELETE FROM books
        WHERE id = %s
    """, (id,))

    # =========================
    # UPDATE AUTHOR BOOK COUNT
    # =========================

    cursor.execute("""
        UPDATE authors
        SET books = books - 1
        WHERE id = %s
    """, (book["author_id"],))

    connection.commit()

    cursor.close()

    return {
        "message": "Book deleted"
    }
# ====================================================
# REVIEWS APIs
# ====================================================

@app.get("/reviews")
def get_reviews():

    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            reviews.id,
            reviews.book_id,
            reviews.author_id,
            books.title AS book,
            authors.name AS author,
            reviews.review
        FROM reviews
        JOIN books
        ON reviews.book_id = books.id
        JOIN authors
        ON reviews.author_id = authors.id
        ORDER BY reviews.id ASC
    """)

    reviews = cursor.fetchall()

    cursor.close()

    return reviews


@app.post("/reviews")
def create_review(data: dict):

    cursor = connection.cursor()

    # =========================
    # GET AUTHOR FROM BOOK
    # =========================
    cursor.execute("""
        SELECT author_id
        FROM books
        WHERE id = %s
    """, (data["book_id"],))

    book = cursor.fetchone()

    if not book:
        cursor.close()
        return {"message": "Book not found"}

    author_id = book["author_id"]

    # =========================
    # INSERT REVIEW
    # =========================
    cursor.execute("""
        INSERT INTO reviews (
            book_id,
            author_id,
            review
        )
        VALUES (%s, %s, %s)
        RETURNING *
    """, (
        data["book_id"],
        author_id,
        data["review"]
    ))

    new_review = cursor.fetchone()

    connection.commit()
    cursor.close()

    return {
        "message": "Review created",
        "data": new_review
    }
    
@app.put("/reviews/{id}")
def update_review(id: int, data: dict):

    cursor = connection.cursor()

    # =========================
    # CHECK REVIEW EXISTS
    # =========================

    cursor.execute("""
        SELECT *
        FROM reviews
        WHERE id = %s
    """, (id,))

    existing_review = cursor.fetchone()

    if not existing_review:

        cursor.close()

        return {
            "message": "Review not found"
        }

    # =========================
    # UPDATE ONLY REVIEW TEXT
    # =========================

    cursor.execute("""
        UPDATE reviews
        SET
            review = %s
        WHERE id = %s
        RETURNING *
    """, (
        data["review"],
        id
    ))

    updated_review = cursor.fetchone()

    connection.commit()

    cursor.close()

    return {
        "message": "Review updated",
        "data": updated_review
    }
    
@app.delete("/reviews/{id}")
def delete_review(id: int):

    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM reviews
        WHERE id = %s
    """, (id,))

    connection.commit()

    cursor.close()

    return {
        "message": "Review deleted"
    }