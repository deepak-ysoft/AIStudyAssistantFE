import { useState, useEffect } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import { MdPerson } from "react-icons/md";
import { authApi } from "../../api/authApi";
import PageHeader from "../../components/PageHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import FormInput from "../../components/FormInput";
import { IKContext, IKUpload } from "imagekitio-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastContext";

export default function ProfilePage() {
  const { user, setUserData } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { showToast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    grade: "",
    studyStreak: "",
    avatar:
      "https://ik.imagekit.io/z0kfygnm4/AI_Assistant/avatar_1767340440548_Ynh1fg4_Dv?updatedAt=1767340444905",
  });

  const [originalProfile, setOriginalProfile] = useState(null);

  /* ---------------- GET PROFILE ---------------- */

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    select: (res) => res.data?.data,
    // 👇 IMPORTANT
    staleTime: 0, // always stale
    refetchOnMount: "always", // refetch when page opens
    refetchOnWindowFocus: true, // refetch when user comes back to tab
  });

  useEffect(() => {
    if (data) {
      const profile = {
        name: data?.name || "",
        email: data?.email || "",
        bio: data?.bio || "",
        grade: data?.grade || "",
        studyStreak: data?.studyStreak ? `${data.studyStreak} days` : "0 days",
        avatar:
          data?.avatar ||
          "https://ik.imagekit.io/z0kfygnm4/AI_Assistant/avatar_1767340440548_Ynh1fg4_Dv?updatedAt=1767340444905",
      };

      setProfileData(profile);
      setOriginalProfile(profile);
      setAvatarPreview(profile.avatar); // ✅ FIX
    }
  }, [data]);

  /* ---------------- UPDATE PROFILE ---------------- */

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      const updatedUser = {
        ...user,
        ...profileData, // includes updated avatar
      };

      setIsEditMode(false);
      setOriginalProfile(profileData);

      // ✅ Update AuthContext state
      setUserData(updatedUser);

      // ✅ Persist to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
  });

  const NAME_REGEX = /^[A-Za-z0-9\s]+$/;

  const GRADES = ["9", "10", "11", "12", "UG", "PG"];

  const validate = () => {
    const newErrors = {};

    /* -------- Name -------- */
    if (!profileData.name?.trim()) {
      newErrors.name = "Full name is required";
    } else if (profileData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!NAME_REGEX.test(profileData.name.trim())) {
      newErrors.name = "Name can contain only letters and numbers";
    }

    /* -------- Grade -------- */
    if (!profileData.grade) {
      newErrors.grade = "Grade is required";
    } else if (!GRADES.includes(profileData.grade)) {
      newErrors.grade = "Invalid grade selected";
    }

    /* -------- Bio -------- */
    if (profileData.bio && profileData.bio.length < 100) {
      newErrors.bio = "Bio must have 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: profileData.name,
      bio: profileData.bio,
      grade: profileData.grade,
      avatar: profileData.avatar, // ✅ string URL
    };

    updateProfileMutation.mutate(payload);
  };

  const startEdit = () => setIsEditMode(true);

  const cancelEdit = () => {
    setProfileData(originalProfile);
    setAvatarPreview(originalProfile.avatar);
    setIsEditMode(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      <PageHeader
        icon={MdPerson}
        title="Profile"
        content="Manage your personal information and account security"
      >
        <div className="flex gap-2">
          {!isEditMode && (
            <PrimaryButton
              onClick={isEditMode ? cancelEdit : startEdit}
              loading={updateProfileMutation.isPending}
            >
              Edit Profile
            </PrimaryButton>
          )}
        </div>
      </PageHeader>

      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-5 sm:p-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <form
            onSubmit={handleProfileSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            noValidate
          >
            <div className="md:col-span-2 flex flex-col items-center gap-3">
              <IKContext
                publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                authenticator={authApi.authenticator}
              >
                <div
                  className={`relative h-28 w-28 rounded-full border-2 border-base-300 overflow-hidden
    ${
      !isEditMode || isUploadingAvatar
        ? "cursor-not-allowed opacity-80"
        : "cursor-pointer hover:opacity-90"
    }
  `}
                >
                  {/* Avatar image */}
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="h-full w-full object-cover p-0.5 rounded-full bg-primary"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-3xl font-bold">
                      {profileData.name?.charAt(0) || "U"}
                    </div>
                  )}

                  {/* Upload loader */}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                      <span className="loading loading-spinner loading-md text-white" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  {isEditMode && !isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100 transition">
                      Change
                    </div>
                  )}

                  {/* ImageKit upload */}
                  {isEditMode && (
                    <IKUpload
                      className="absolute inset-0 opacity-0"
                      accept="image/*"
                      folder="/AI_Assistant"
                      fileName={`avatar_${Date.now()}`}
                      disabled={isUploadingAvatar}
                      onUploadStart={(evt) => {
                        // 🔥 instant local preview
                        const file = evt.target.files?.[0];
                        if (file) {
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                        setIsUploadingAvatar(true);
                      }}
                      onSuccess={(res) => {
                        setProfileData((prev) => ({
                          ...prev,
                          avatar: res.url, // final CDN URL
                        }));
                        setAvatarPreview(res.url);
                        setIsUploadingAvatar(false);
                      }}
                      onError={(err) => {
                        console.error("ImageKit upload error", err);
                        setIsUploadingAvatar(false);
                      }}
                    />
                  )}
                </div>
              </IKContext>
            </div>

            <FormInput
              label="Full Name"
              value={profileData.name}
              disabled={!isEditMode}
              onChange={(e) => {
                setProfileData({ ...profileData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              error={errors.name}
            />

            <FormInput label="Email" value={profileData.email} disabled />
            <FormInput
              label="Study Streak"
              value={profileData.studyStreak}
              disabled
            />

            <FormInput
              label="Grade"
              type="select"
              value={profileData.grade}
              disabled={!isEditMode}
              onChange={(e) => {
                setProfileData({ ...profileData, grade: e.target.value });
                setErrors({ ...errors, grade: "" });
              }}
              options={[
                { label: "9", value: "9" },
                { label: "10", value: "10" },
                { label: "11", value: "11" },
                { label: "12", value: "12" },
                { label: "UG", value: "UG" },
                { label: "PG", value: "PG" },
              ]}
              error={errors.grade}
            />

            <div className="md:col-span-2">
              <FormInput
                label="Bio"
                type="textarea"
                value={profileData.bio}
                disabled={!isEditMode}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
              />
            </div>

            {isEditMode && (
              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <button type="button" className="btn " onClick={cancelEdit}>
                  Cancel
                </button>

                <PrimaryButton
                  type="submit"
                  loading={updateProfileMutation.isPending}
                >
                  Save Changes
                </PrimaryButton>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
