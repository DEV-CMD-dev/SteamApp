import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"; // Переконайся, що шлях правильний
import "../css/Friends/friendsPage.css";

// Типи для вкладок
type TabType = "friends" | "add" | "pending";

export default function FriendsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("friends");

    // Заглушка для кількості друзів, заміниш на реальні дані
    const friendsCount = 26;

    return (
        <div className="friends-page-wrapper">
            {/* Верхня навігація (як у ChatPage) */}
            <div className="mini-navbar-container">
                <div className="site-logo-wrap" onClick={() => navigate("/")} title="Main">
                    <img src={logo} alt="Logo" className="site-logo-icon" />
                </div>
            </div>

            <div className="friends-layout">
                {/* Ліва панель навігації */}
                <div className="friends-sidebar">
                    <h3 className="sidebar-section-title">FRIENDS</h3>
                    
                    <div className="sidebar-nav-list">
                        <button 
                            className={`sidebar-nav-item ${activeTab === "friends" ? "active" : ""}`}
                            onClick={() => setActiveTab("friends")}
                        >
                            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span className="nav-text">Your Friends</span>
                            <span className="nav-count">{friendsCount}</span>
                        </button>

                        <button 
                            className={`sidebar-nav-item ${activeTab === "add" ? "active" : ""}`}
                            onClick={() => setActiveTab("add")}
                        >
                            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                            <span className="nav-text">Add a Friend</span>
                        </button>

                        <button 
                            className={`sidebar-nav-item ${activeTab === "pending" ? "active" : ""}`}
                            onClick={() => setActiveTab("pending")}
                        >
                            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <span className="nav-text">Pending Invites</span>
                        </button>
                    </div>
                </div>

                {/* Права частина з контентом */}
                <div className="friends-content-area">
                    {activeTab === "friends" && (
                        <div className="tab-content">
                            {/* Тут буде твій список друзів */}
                            <h2>Твої друзі</h2>
                            <p className="placeholder-text">Список друзів буде тут...</p>
                        </div>
                    )}

                    {activeTab === "add" && (
                        <div className="tab-content">
                            {/* Тут буде пошук для додавання */}
                            <h2>Додати друга</h2>
                            <div className="add-friend-search-wrap">
                                <input type="text" placeholder="Пошук друзів..." className="friend-search-input" />
                            </div>
                        </div>
                    )}

                    {activeTab === "pending" && (
                        <div className="tab-content">
                            {/* Тут будуть запити */}
                            <h2>Запити в друзі</h2>
                            <p className="placeholder-text">Немає нових запитів.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}