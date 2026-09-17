import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { LibraryGameVersionDto } from "../../../DTOs/GameVersion/LibraryGameVersionDto";
import type { FriendProfileDto } from "../../../DTOs/Profile/FriendProfileDto";
import { AuthContext } from "../../../contexts/AuthContext";
import { decodeUserIdFromToken } from "../../../utils/jwt";
import wrenchIcon from "../../../assets/wrench.png";
import styles from "../../../css/libraryPage/details/GameActivityFeed.module.css";

interface GameActivityFeedProps {
  versions: LibraryGameVersionDto[];
  friends: FriendProfileDto[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr)
    .toLocaleDateString("en-US", { day: "numeric", month: "long" })
    .toUpperCase();
}

export default function GameActivityFeed({ versions, friends }: GameActivityFeedProps) {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const handleFriendClick = (friendUserId: string) => {
    const currentUserId = accessToken ? decodeUserIdFromToken(accessToken) : null;

    if (friendUserId !== currentUserId) {
      const params = new URLSearchParams();
      params.append("userId", friendUserId);
      navigate(`/profile?${params}`);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.feed}>
        {versions.length > 0 ? (
          versions.map((version) => (
            <div key={`${version.gameId}-${version.createdAt}`} className={styles.feedItem}>
              <h3 className={styles.dateHeading}>{formatDate(version.createdAt)}</h3>

              <div className={styles.updateCard}>
                <div className={styles.updateIcon}>
                  <img src={wrenchIcon} alt="" />
                </div>
                <div className={styles.updateContent}>
                  <span className={styles.updateLabel}>
                    MINOR UPDATE / CHANGE LOG
                  </span>
                  <p className={styles.updateText}>
                    {version.patchNotes || version.version}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>No update history available.</p>
        )}
      </section>

      <aside className={styles.friendsPanel}>
        <h4 className={styles.friendsHeading}>FRIENDS WHO USE THIS</h4>

        <div className={styles.friendsCard}>
          <span className={styles.friendsCount}>
            Friends who have played: {friends.length}
          </span>

          {friends.length > 0 && (
            <div className={styles.friendsAvatars}>
              {friends.slice(0, 6).map((friend) => (
                <div
                  key={friend.userId}
                  className={styles.friendAvatar}
                  style={{ backgroundImage: `url(${friend.avatar || ""})` }}
                  title={friend.name}
                  onClick={() => handleFriendClick(friend.userId)}
                />
              ))}
            </div>
          )}

          {friends.length > 6 && (
            <span className={styles.friendsMore}>All friends who played</span>
          )}
        </div>
      </aside>
    </div>
  );
}