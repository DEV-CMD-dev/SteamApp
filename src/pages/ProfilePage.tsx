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
                        <div className="level-badge">
                            <strong>{loading ? "..." : level}</strong>
                        </div>
                        <div className="profile-rank-label">
                            <span>Level</span>
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
                        const unlockedAchievements = game.achievements.filter((achievement) => achievement.isUnlocked).length;
                        const progress = game.achievements.length
                            ? Math.round((unlockedAchievements / game.achievements.length) * 100)
                            : 0;
                        const lastPlayDate = new Date(game.lastPlayDate).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "long",
                        });

                        return (
                            <article key={game.id} className="achievement-item">
                                <div className="achievement-cover" aria-label={game.title}>
                                    {game.coverImageHorizontal && <img src={game.coverImageHorizontal} alt="" />}
                                </div>

                                <div className="achievement-data">
                                    <div className="achievement-header">
                                        <h3>{game.title}</h3>
                                        <div className="achievement-played">
                                            <span>last played {lastPlayDate}</span>
                                            <span>{Math.floor(game.playTimeMinutes / 60)} hours of playing</span>
                                        </div>
                                    </div>
                                    <div className="achievement-meta">{unlockedAchievements} of {game.achievements.length} achievements</div>
                                    <div className="achievement-progress">
                                        <span style={{ width: `${progress}%` }} />
                                    </div>
                                </div>

                                <div className="achievement-badges">
                                    {game.achievements.map((achievement) => (
                                        <span
                                            key={achievement.id}
                                            className={`achievement-badge ${achievement.isUnlocked ? "positive" : "neutral"}`}
                                            aria-label={achievement.name}
                                            role="img">
                                            {achievement.iconUrl && <img src={achievement.iconUrl} alt="" aria-hidden="true" />}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        );
                    })}
                </main>

                <aside className="profile-sidebar">
                    <div className="sidebar-panel">
                        <h4>Settings</h4>
                        <div className="settings-list">
                            <div className="setting-row"><span>Activity</span><span className="dot" /></div>
                            <div className="setting-row"><span>Groups</span></div>
                            <div className="setting-row"><span>Badges</span></div>
                        </div>
                    </div>

                    <div className="sidebar-panel">
                        <h4>Friends</h4>
                        <div className="friend-list">
                            {friends.map((friend) => (
                                <div key={friend.name} className="friend-row">
                                    <div className="friend-avatar" />
                                    <div className="friend-content">
                                        <span className="friend-name">{friend.name}</span>
                                        <span className="friend-status">{friend.status}</span>
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