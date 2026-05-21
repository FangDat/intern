import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import authorsIcon from "../assets/author.png";
import bookIcon from "../assets/book.png";
import reviewIcon from "../assets/review.png";

const sections = [
  {
    key: "authors",
    label: "Authors",
    icon: authorsIcon,
    listPath: "/authors",
    createPath: "/authors/create",
  },
  {
    key: "books",
    label: "Books",
    icon: bookIcon,
    listPath: "/books",
    createPath: "/books/create",
  },
  {
    key: "reviews",
    label: "Reviews",
    icon: reviewIcon,
    listPath: "/reviews",
    createPath: "/reviews/create",
  },
];

export default function Sidebar() {
  const [openSection, setOpenSection] =
    useState("authors");

  const toggleSection = (key) => {
    setOpenSection((prev) =>
      prev === key ? "" : key
    );
  };

  return (
    <aside className="sidebar">
      {sections.map((section) => {
        const isOpen =
          openSection === section.key;

        return (
          <div
            key={section.key}
            className="sidebar-section"
          >
            <button
              type="button"
              className={`sidebar-section__header ${
                isOpen ? "is-open" : ""
              }`}
              onClick={() =>
                toggleSection(section.key)
              }
            >
              <span className="sidebar-section__iconWrap">
                <img
                  src={section.icon}
                  alt={section.label}
                  className="sidebar-section__icon"
                />
              </span>

              <span className="sidebar-section__label">
                {section.label}
              </span>

              <span className="sidebar-section__chevron">
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {isOpen && (
              <div className="sidebar-submenu">
                <NavLink
                  to={section.listPath}
                  end
                  className={({ isActive }) =>
                    `sidebar-submenu__item ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  List
                </NavLink>

                <NavLink
                  to={section.createPath}
                  className={({ isActive }) =>
                    `sidebar-submenu__item ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Create
                </NavLink>
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}