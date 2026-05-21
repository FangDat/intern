import React from "react";
import BookList from "./pages/BookList";
import ReviewList from "./pages/ReviewList";
import AuthorUpdate from "./pages/AuthorUpdate";
import BookUpdate from "./pages/BookUpdate";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layout/AppLayout";

import AuthorList from "./pages/AuthorList";
import AuthorCreate from "./pages/AuthorCreate";
import BookCreate from "./pages/BookCreate";
import ReviewCreate from "./pages/ReviewCreate";
import ReviewUpdate from "./pages/ReviewUpdate";



export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/authors"
            replace
          />
        }
      />

      <Route element={<AppLayout />}>
        <Route
          path="/authors"
          element={<AuthorList />}
        />
        <Route
          path="/authors/create"
          element={<AuthorCreate />}
        />

        <Route
          path="/authors/update/:id"
          element={<AuthorUpdate />}
        />
        <Route
          path="/books"
          element={<BookList />}
        />
        <Route
          path="/books/update/:id"
          element={<BookUpdate />}
        />

        <Route
          path="/books/create"
          element={<BookCreate />}
        />

        <Route
          path="/reviews"
          element={<ReviewList />}
        />

        <Route
          path="/reviews/create"
          element={<ReviewCreate />}
        />
        <Route
          path="/reviews/update/:id"
          element={<ReviewUpdate />}
        />


      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/authors"
            replace
          />
        }
      />
    </Routes>
  );
}