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
    const { accessToken } = useContext(AuthContext);
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
            .catch((err) => {
                console.error("Failed to load profile for editing", err);
                setError("Failed to load profile data.");
            })
            .finally(() => setLoading(false));
    }, [accessToken, navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <div className="edit-profile-card">
                <h1>Edit Profile</h1>

                {error && <div className="form-error">{error}</div>}

                {loading ? (
                    <div className="loading-state">Loading profile...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="edit-profile-form">
                        <label>
                            Avatar URL
                            <input
                                type="url"
                                name="avatar"
                                value={form.avatar}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.png"
                            />
                        </label>

                        <label>
                            Badges
                            <textarea
                                name="badges"
                                value={form.badges}
                                onChange={handleChange}
                                placeholder="badge1, badge2, badge3"
                            />
                        </label>

                        <label>
                            Showcase
                            <textarea
                                name="showcase"
                                value={form.showcase}
                                onChange={handleChange}
                                placeholder="Describe your showcase..."
                            />
                        </label>

                        <div className="form-actions">
                            <button type="button" className="secondary-button" onClick={() => navigate("/profile")}>
                                Cancel
                            </button>
                            <button type="submit" className="primary-button" disabled={saving}>
                                {saving ? "Saving..." : "Save profile"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
