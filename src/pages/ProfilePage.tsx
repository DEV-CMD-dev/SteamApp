import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { ProfileDto } from "../DTOs/Profile/ProfileDto";
import { profileService } from "../services/profileService";
import { decodeUserIdFromToken } from "../utils/jwt";
import "../css/profilePage.css";

export default function ProfilePage() {
    const { accessToken, logout, username } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const userId = decodeUserIdFromToken(accessToken);
        if (!userId) {
            setLoading(false);
            return;
        }

        profileService
            .getProfile(userId)
            .then((profileData) => setProfile(profileData))
            .catch((error) => {
                console.error("Failed to load profile", error);
            })
            .finally(() => setLoading(false));
    }, [accessToken]);

    if (!accessToken) {
        return null;
    }

    const level = profile?.level ?? 0;
    const xp = profile?.xp ?? 0;
    const avatarUrl = profile?.avatar || "";
    const badgeCount = profile?.badges
        ? profile.badges.split(",").length
        : 0;

    const recentlyPlayedGames = profile?.recentlyPlayedGames ?? [];

    const friends = [
        { name: "nexus", status: "online", count: 12 },
        { name: "Lightcan", status: "offline", count: 16 },
        { name: "Black BOX", status: "offline", count: 76 },
        { name: "Adam", status: "offline", count: 45 },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="profile-summary">
                    <div className="profile-avatar-shell">
                        {avatarUrl ? (
                            <img className="profile-avatar" src={avatarUrl} alt="User avatar" />
                        ) : (
                            <div className="profile-avatar" aria-label="User avatar" />
                        )}
                    </div>

                    <div className="profile-meta">
                        <h1>{username}</h1>
                        <p>{username}</p>
                    </div>
                </div>

                <div className="profile-right">
                    <div className="profile-rank">
                        <div className="profile-rank-label">
                            <span>Level</span>
                        </div>
                        <div className="level-badge">
                            <strong>{loading ? "..." : level}</strong>
                        </div>
                    </div>

                    <div className="profile-identity">
                        <div className="profile-identity-card">
                            <div className="badge">{loading ? "..." : badgeCount}</div>
                            <div className="text">
                                <strong>{profile?.badges}</strong>
                                <span>{loading ? "Loading XP..." : `${xp} XP`}</span>
                            </div>
                        </div>
                    </div>

                    <button type="button" className="edit-button" onClick={() => navigate("/profile/edit")}>
                        Edit Profile
                    </button>
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
                        const unlockedList = game.achievements.filter((achievement) => achievement.isUnlocked);
                        const progress = game.achievements.length
                            ? Math.round((unlockedList.length / game.achievements.length) * 100)
                            : 0;
                        const lastPlayDate = new Date(game.lastPlayDate).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "long",
                        });
                        const visibleAchievements = unlockedList.slice(0, 5);
                        const remainingCount = unlockedList.length - visibleAchievements.length;

                        return (
                            <article key={game.id} className="achievement-item">
                                <div className="achievement-top">
                                    <div className="achievement-cover" aria-label={game.title}>
                                        {game.coverImageHorizontal && <img src={game.coverImageHorizontal} alt="" />}
                                    </div>

                                    <h3 className="achievement-title">{game.title}</h3>

                                    <div className="achievement-played">
                                        <span>{Math.floor(game.playTimeMinutes / 60)} hrs on record</span>
                                        <span>last played {lastPlayDate}</span>
                                    </div>
                                </div>

                                <div className="achievement-stats-bar">
                                    <span className="achievement-meta">{unlockedList.length} of {game.achievements.length} achievements</span>
                                    <div className="achievement-progress">
                                        <span style={{ width: `${progress}%` }} />
                                    </div>
                                    <div className="achievement-badges">
                                        {visibleAchievements.map((achievement) => (
                                            <span
                                                key={achievement.id}
                                                className="achievement-badge positive"
                                                aria-label={achievement.name}
                                                role="img">
                                                {achievement.iconUrl && <img src={achievement.iconUrl} alt="" aria-hidden="true" />}
                                            </span>
                                        ))}
                                        {remainingCount > 0 && (
                                            <span className="achievement-more">+{remainingCount}</span>
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
                            <button type="button" className="setting-row setting-link" onClick={() => navigate("/settings")}>
                                <span>Settings</span>
                            </button>
                            <button type="button" className="setting-row setting-link" onClick={() => navigate("/settings?section=activity")}>
                                <span>Activity</span>
                                <span className="dot" />
                            </button>
                            <button type="button" className="setting-row setting-link" onClick={() => navigate("/settings?section=groups")}>
                                <span>Groups</span>
                            </button>
                            <button type="button" className="setting-row setting-link" onClick={() => navigate("/settings?section=badges")}>
                                <span>Badges</span>
                            </button>
                        </div>
                    </div>

                    <div className="sidebar-panel" id="friends-panel">
                        <h4>Friends</h4>
                        <div className="friend-list">
                            {friends.map((friend) => (
                                <div key={friend.name} className="friend-row">
                                    <div className="friend-avatar" />
                                    <div className="friend-content">
                                        <span className="friend-name">{friend.name}</span>
                                        <span className={`friend-status ${friend.status === "online" ? "online" : "offline"}`}>
                                            {friend.status}
                                        </span>
                                    </div>
                                    <div className="friend-count">{friend.count}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            <button type="button" className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}