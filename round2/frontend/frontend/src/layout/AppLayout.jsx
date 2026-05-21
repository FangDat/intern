import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
    return(
        <div className="app-shell">
            <Header/>
            <div className="app-body">
                <Sidebar />
                <main className="app-content">
                    <Outlet />
                
                </main>

            </div>
        </div>
    )
}