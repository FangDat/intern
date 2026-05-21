import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const currentPage = useMemo(() => {
    const pathname = location.pathname;

    if (pathname.startsWith("/authors")) {
        return pathname.includes("/create") 
        ? "Author > Create"
        : "Author > List";
    }

    if (pathname.startsWith("/books")) {
        return pathname.includes("/create") 
        ? "Book > Create"
        : "Book > List";
    }
    if (pathname.startsWith("/reviews")) {
        return pathname.includes("/create") 
        ? "Review > Create"
        : "Review > List";
    }
    return "Dashboard";
}, [location.pathname]);

return (
    <header className="top-header">
        <div className="top-header__title">HAIBAZO BOOK REVIEW</div>

        <div className="top-header__current-page">{currentPage}</div>
    </header>
);
}