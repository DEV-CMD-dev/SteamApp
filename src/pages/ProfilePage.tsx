import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ProfileDto } from "../DTOs/Profile/ProfileDto";
import { profileService } from "../services/profileService";
import { decodeUserIdFromToken } from "../utils/jwt";
import "../css/profilePage.css";
import type { PaginatedList } from "../DTOs/PaginatedList";
import type { FriendProfileDto } from "../DTOs/Profile/FriendProfileDto";

export default function ProfilePage() {
    const { accessToken, logout, username } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [friends, setFriends] = useState<PaginatedList<FriendProfileDto>>();
    const [searchParams] = useSearchParams();
    const paramUserId = searchParams.get("userId") || null;
    const [loading, setLoading] = useState(true);

    async function GetFriends() {
        try {
            const data = await profileService.GetFriends();
            setFriends(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function GetUserFriends() {
        if (paramUserId) {
            try {
                const data = await profileService.GetFriends(paramUserId);
                setFriends(data);
            } catch (error) {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        if (paramUserId) {
            GetUserFriends();
            profileService
                .getProfile(paramUserId)
                .then((profileData) => setProfile(profileData))
                .catch((error) => {
                    console.error("Failed to load profile", error);
                })
                .finally(() => setLoading(false));
        } else {
            const userId = decodeUserIdFromToken(accessToken);
            if (!userId) {
                setLoading(false);
                return;
            }
            GetFriends();
            profileService
                .getProfile(userId)
                .then((profileData) => setProfile(profileData))
                .catch((error) => {
                    console.error("Failed to load profile", error);
                })
                .finally(() => setLoading(false));
        }
    }, [accessToken, paramUserId]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!accessToken) {
        return null;
    }

    const level = profile?.level ?? 0;
    const avatarUrl = profile?.avatar || "";
    const bio = profile?.bio || "No bio";
    const showcaseUrl = profile?.showcase || "";
    const recentlyPlayedGames = profile?.recentlyPlayedGames ?? [];

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div
                    className="profile-banner"
                    style={showcaseUrl ? { backgroundImage: `url(${showcaseUrl})` } : undefined}
                >
                    <div className="profile-banner-overlay" />

                    <div className="profile-summary">
                        <div className="profile-avatar-shell">
                            {avatarUrl ? (
                                <img
                                    className="profile-avatar"
                                    src={avatarUrl}
                                    alt="User avatar"
                                />
                            ) : (
                                <div className="profile-avatar" aria-label="User avatar" />
                            )}
                        </div>

                        <div className="profile-meta">
                            <h2>{profile?.userName || username || "User"}</h2>
                            <p>{bio}</p>
                        </div>
                    </div>

                    <div className="profile-right">
                        <div className="profile-rank">
                            <div className="level-badge">
                                <strong>{loading ? "..." : level}</strong>
                            </div>
                            <div className="profile-rank-label">
                                <span>Level</span>
                            </div>
                        </div>

                        {!paramUserId && (
                            <button
                                type="button"
                                className="edit-button"
                                onClick={() => navigate("/profile/edit")}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="profile-content">
                <main className="achievement-list">
                    {!loading && recentlyPlayedGames.length === 0 && (
                        <div className="achievement-empty-state">
                            <strong>No recently played games</strong>
                            <span>Your recently played games will appear here.</span>
                        </div>
                    )}

                    {recentlyPlayedGames.map((game) => {
                        const unlockedList = game.achievements.filter(
                            (achievement) => achievement.isUnlocked
                        );
                        const progress = game.achievements.length
                            ? Math.round((unlockedList.length / game.achievements.length) * 100)
                            : 0;
                        const lastPlayDate = new Date(game.lastPlayDate).toLocaleDateString(
                            undefined,
                            {
                                day: "numeric",
                                month: "long",
                            }
                        );
                        const visibleAchievements = unlockedList.slice(0, 5);
                        const remainingCount = unlockedList.length - visibleAchievements.length;

                        return (
                            <article key={game.id} className="achievement-item">
                                <div className="achievement-top">
                                    <div className="achievement-cover" aria-label={game.title}>
                                        {game.coverImageHorizontal && (
                                            <img src={game.coverImageHorizontal} alt="" />
                                        )}
                                    </div>

                                    <h3 className="achievement-title">{game.title}</h3>

                                    <div className="achievement-played">
                                        <span>
                                            {Math.floor(game.playTimeMinutes / 60)} hrs on record
                                        </span>
                                        <span>last played {lastPlayDate}</span>
                                    </div>
                                </div>

                                <div className="achievement-stats-bar">
                                    <span className="achievement-meta">
                                        {unlockedList.length} of {game.achievements.length}{" "}
                                        achievements
                                    </span>
                                    <div className="achievement-progress">
                                        <span style={{ width: `${progress}%` }} />
                                    </div>
                                    <div className="achievement-badges">
                                        {visibleAchievements.map((achievement) => (
                                            <span
                                                key={achievement.id}
                                                className="achievement-badge positive"
                                                aria-label={achievement.name}
                                                role="img"
                                            >
                                                {achievement.iconUrl && (
                                                    <img
                                                        src={achievement.iconUrl}
                                                        alt=""
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </span>
                                        ))}
                                        {remainingCount > 0 && (
                                            <span className="achievement-more">
                                                +{remainingCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </main>

                <aside className="profile-sidebar">
                    <div className="sidebar-panel">
                        <div className="settings-list">
                            <button
                                type="button"
                                className="setting-row setting-link"
                                onClick={() => navigate("/settings")}
                            >
                                <span>Settings</span>
                            </button>
                            <button
                                type="button"
                                className="setting-row setting-link"
                                onClick={() => navigate("/settings?section=activity")}
                            >
                                <span>Activity</span>
                                <span className="dot" />
                            </button>
                            <button
                                type="button"
                                className="setting-row setting-link"
                                onClick={() => navigate("/settings?section=groups")}
                            >
                                <span>Groups</span>
                            </button>
                            <button
                                type="button"
                                className="setting-row setting-link"
                                onClick={() => navigate("/settings?section=badges")}
                            >
                                <span>Badges</span>
                            </button>
                            <button
                                type="button"
                                className="setting-row setting-link"
                                onClick={() => navigate("/inventory")}
                            >
                                <span>Inventory</span>
                            </button>
                            <button
                                type="button"
                                className="setting-row setting-link"
                                onClick={() => navigate("/chat")}
                            >
                                <span>Chat</span>
                            </button>
                        </div>
                    </div>

                    <div className="sidebar-panel" id="friends-panel">
                        <h4 style={{cursor : "pointer"}} onClick={() => navigate("/friends")}>Friends</h4>
                        <div className="friend-list">
                            {friends?.items.map((friend) => (
                                <div
                                    key={friend.name}
                                    className="friend-row"
                                    onClick={() => {
                                        if (friend.userId !== decodeUserIdFromToken(accessToken)) {
                                            const params = new URLSearchParams();
                                            params.append("userId", friend.userId);
                                            navigate(`/profile?${params}`);
                                        } else {
                                            navigate(`/profile`);
                                        }
                                    }}
                                >
                                    <div
                                        className="friend-avatar"
                                        style={{ backgroundImage: `url(${friend.avatar})` }}
                                    />
                                    <div className="friend-content">
                                        <span className="friend-name">{friend.name}</span>
                                    </div>
                                    <div className="level-badge">{friend.level}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {!paramUserId && (
                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            )}
        </div>
    );
}