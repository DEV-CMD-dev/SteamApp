import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { decodeUserIdFromToken } from "../utils/jwt";
import { profileService } from "../services/profileService";
import "../css/editProfilePage.css";

type ProfileFormState = {
  avatar: string;
  badges: string;
  showcase: string;
};

const emptyForm: ProfileFormState = {
  avatar: "",
  badges: "",
  showcase: "",
};

export default function EditProfilePage() {
  const { accessToken, username } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState<ProfileFormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
      return;
    }

    const userId = decodeUserIdFromToken(accessToken);
    if (!userId) {
      navigate("/profile");
      return;
    }

    profileService
      .getProfile(userId)
      .then((profile) => {
        setForm({
          avatar: profile.avatar ?? "",
          badges: profile.badges ?? "",
          showcase: profile.showcase ?? "",
        });
      })
      .catch(() => {
        setError("Failed to load profile data.");
      })
      .finally(() => setLoading(false));
  }, [accessToken, navigate]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      navigate("/auth");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await profileService.updateProfile({
        avatar: form.avatar.trim(),
        badges: form.badges.trim(),
        showcase: form.showcase.trim(),
      });
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-panel">
        <h1 className="edit-profile-title">Edit Profile</h1>

        {error && <div className="edit-profile-error">{error}</div>}

        {loading ? (
          <div className="edit-profile-loading">Loading profile...</div>
        ) : (
          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div
              className="edit-profile-banner-preview"
              style={
                form.showcase
                  ? { backgroundImage: `url(${form.showcase})` }
                  : undefined
              }>
              <div className="edit-profile-banner-overlay" />
              <div className="edit-profile-banner-content">
                <div className="edit-profile-avatar">
                  {form.avatar ? (
                    <img src={form.avatar} alt="Avatar preview" />
                  ) : (
                    <div className="edit-profile-avatar-placeholder">
                      {username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="edit-profile-preview-meta">
                  <span className="edit-profile-preview-name">{username}</span>
                  <span className="edit-profile-preview-hint">
                    Bio
                  </span>
                </div>
              </div>
            </div>

            <div className="edit-profile-field">
              <label htmlFor="avatar">Avatar</label>
              <input
                id="avatar"
                type="url"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.png"/>
            </div>

            <div className="edit-profile-field">
              <label htmlFor="showcase">Showcase</label>
              <input
                id="showcase"
                type="url"
                name="showcase"
                value={form.showcase}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"/>
            </div>

            <div className="edit-profile-actions">
              <button
                type="button"
                className="edit-profile-btn-secondary"
                onClick={() => navigate("/profile")}>
                Cancel
              </button>
              <button
                type="submit"
                className="edit-profile-btn"
                disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}