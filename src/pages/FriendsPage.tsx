import React, { useContext, useEffect, useState } from "react";
import "../css/Friends/friendsPage.css";
import type { MiniProfileDto } from "../DTOs/Profile/MiniProfileDto";
import { orderService } from "../services/navbarService";
import type { PaginatedList } from "../DTOs/PaginatedList";
import { profileService } from "../services/profileService";
import type { FriendProfileDto } from "../DTOs/Profile/FriendProfileDto";
import { SignalRContext } from "../contexts/SignalRContext";
import type { ProfileSearchResultDto } from "../DTOs/Profile/ProfileSearchResultDto";
import { AuthContext } from "../contexts/AuthContext";
import { decodeUserIdFromToken } from "../utils/jwt";
import { friendsService } from "../services/friendsService";
import { useNavigate } from "react-router-dom";
import type { ProfileDto } from "../DTOs/Profile/ProfileDto";

type TabType = "friends" | "add" | "pending";

export default function FriendsPage() {
    const { accessToken } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<TabType>("friends");
    const [miniProfile, setMiniProfile] = useState<MiniProfileDto>();
    const [invites, setInvites] = useState<PaginatedList<ProfileDto>>();
    const navigate = useNavigate();
    const [friends, setFriends] = useState<PaginatedList<FriendProfileDto>>();
    const [searchResults, setSearchResults] = useState<ProfileSearchResultDto[]>([]);
    const currentUserId = accessToken ? decodeUserIdFromToken(accessToken) : null;

    const { connection } = useContext(SignalRContext);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const timeout = setTimeout(() => {
            profileService
                .searchfriends(searchQuery.trim())
                .then((results) => setSearchResults(results.filter((r) => r.userId !== currentUserId)))
                .catch((error) => console.error("Failed to search users", error));
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchQuery, currentUserId]);
    useEffect(() => {
        if (!connection) return;

        const handleUserConnected = (connectedUserId: string) => {
            setFriends((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((frnd) => frnd.userId === connectedUserId ? { ...frnd, isOnline: true } : frnd)
                }
            });
        };

        const handleUserDisconnected = (disconnectedUserId: string) => {
            setFriends((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((frnd) => frnd.userId === disconnectedUserId ? { ...frnd, isOnline: false } : frnd)
                }
            });
        };

        connection.on("UserConnected", handleUserConnected);
        connection.on("UserDisconnected", handleUserDisconnected);

        return () => {
            connection.off("UserConnected", handleUserConnected);
            connection.off("UserDisconnected", handleUserDisconnected);
        };
    }, [connection]);

    async function GetUser() {
        try {
            const data = await orderService.getUser();
            setMiniProfile(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getIncomingInvites() {
        try {
            const data = await friendsService.GetIncomingInvites();
            setInvites(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function SendFriendRequest(userName: string) {
        try {
            await friendsService.SendFriendRequest(userName);
        } catch (error) {
            console.error(error);
        }
    }

    async function AcceptFriendRequest(userId: string) {
        try {
            await friendsService.AcceptFriendRequest(userId);
            getIncomingInvites();
        } catch (error) {
            console.error(error);
        }
    }

    async function DeclineFriendRequest(userId: string) {
        try {
            await friendsService.DeclineFriendRequest(userId);
            getIncomingInvites();
        } catch (error) {
            console.error(error);
        }
    }


    async function GetUserFriends() {
        try {
            const data = await profileService.GetFriends(undefined, 1, 50);
            setFriends(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        GetUser();
        GetUserFriends();
        getIncomingInvites();
    }, []);

    return (
        <div className="friends-page-container">
            <div className="friends-layout">
                <div className="friends-sidebar">
                    <div className="user-profile-header">
                        <img src={miniProfile?.avatar || ""} alt={miniProfile?.name} className="user-avatar" />
                        <span className="user-name">{miniProfile?.name}</span>
                    </div>

                    <h3 className="sidebar-section-title">FRIENDS</h3>

                    <div className="sidebar-nav-list">
                        <button
                            className={`sidebar-nav-item ${activeTab === "friends" ? "active" : ""}`}
                            onClick={() => setActiveTab("friends")}
                        >
                            <span className="nav-text">Your Friends</span>
                            <span className="nav-count">{friends?.items.length ?? 0}</span>
                        </button>

                        <button
                            className={`sidebar-nav-item ${activeTab === "add" ? "active" : ""}`}
                            onClick={() => setActiveTab("add")}
                        >
                            <span className="nav-text">Add a Friend</span>
                        </button>

                        <button
                            className={`sidebar-nav-item ${activeTab === "pending" ? "active" : ""}`}
                            onClick={() => setActiveTab("pending")}
                        >
                            <span className="nav-text">Pending Invites</span>
                        </button>
                    </div>
                </div>

                <div className="friends-content-area">
                    {activeTab === "friends" && (
                        <div className="tab-content">
                            <div className="friends-section">
                                <h4 className="section-heading">ONLINE</h4>
                                <div className="friends-grid">
                                    {friends?.items.map(frnd => frnd.isOnline === true && (
                                        <div key={frnd.userId} onClick={() => { navigate(`/profile?userId=${frnd.userId}`); }} className="friend-card online-card">
                                            <img src={frnd?.avatar || "https://via.placeholder.com/44"} alt={frnd.name} className="friend-card-avatar" />
                                            <div className="friend-card-info">
                                                <span className="friend-card-name online-name">{frnd.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="friends-section">
                                <h4 className="section-heading">OFFLINE</h4>
                                <div className="friends-grid">
                                    {friends?.items.map(frnd => frnd.isOnline === false && (
                                        <div key={frnd.userId} onClick={() => { navigate(`/profile?userId=${frnd.userId}`); }} className="friend-card offline-card">
                                            <img src={frnd?.avatar || "https://via.placeholder.com/44"} alt={frnd.name} className="friend-card-avatar" />
                                            <div className="friend-card-info">
                                                <span className="friend-card-name offline-name">{frnd.name}</span>
                                                <span className="friend-card-status">Offline</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "add" && (
                        <div className="tab-content">
                            <div className="content-header-bar">
                                <span className="header-title">ADD A FRIEND</span>
                            </div>
                            <div className="search-bar-wrap" style={{ marginTop: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Search for friends..."
                                    className="friends-search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {searchQuery.length > 0 && (
                                <div className="friends-section">
                                    <h4 className="section-heading">SEARCH RESULTS</h4>
                                    <div className="friends-grid">
                                        {searchResults.filter(u => u.userName.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                                            <div key={user.userId} className="friend-card search-result-card">
                                                <div className="friend-card-left">
                                                    <img src={user?.avatar || ""} alt={user.userName} className="friend-card-avatar" />
                                                    <div className="friend-card-info">
                                                        <span className="friend-card-name offline-name">{user.userName}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => SendFriendRequest(user.userName)} className="add-friend-btn">
                                                    Add
                                                </button>
                                            </div>
                                        ))}
                                        {searchResults.filter(u => u.userName.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                            <p className="placeholder-text">No users found.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "pending" && (
                        <div className="tab-content">
                            <div className="content-header-bar">
                                <span className="header-title">PENDING INVITES</span>
                            </div>

                            <div className="friends-section" style={{ marginTop: '20px' }}>
                                <div className="friends-grid search-results-grid">
                                    {invites?.items.map(user => (
                                        <div key={user.userId} className="friend-card search-result-card">
                                            <div className="friend-card-left">
                                                <img src={user?.avatar || ""} alt={user.userName} className="friend-card-avatar" />
                                                <div className="friend-card-info">
                                                    <span className="friend-card-name offline-name">{user.userName}</span>
                                                </div>
                                            </div>
                                            <div className="invite-actions">
                                                <button onClick={() => AcceptFriendRequest(user.userId)} className="accept-btn">Accept</button>
                                                <button onClick={() => DeclineFriendRequest(user.userId)} className="decline-btn">Ignore</button>
                                            </div>
                                        </div>
                                    ))}
                                    {invites?.items.length === 0 && (
                                        <div className="placeholder-container">
                                            <p className="placeholder-text">No pending invites.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}