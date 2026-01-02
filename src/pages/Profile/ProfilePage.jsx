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

  const { showToast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    grade: "",
    studyStreak: "",
    avatar:
      "https://ik.imagekit.io/z0kfygnm4/AI_Assistant/avtar?updatedAt=1766064351087",
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
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        grade: data.grade || "",
        studyStreak: data.studyStreak || "",
        avatar:
          data.avatar ||
          "https://ik.imagekit.io/z0kfygnm4/AI_Assistant/avtar?updatedAt=1766064351087",
      };

      setProfileData(profile);
      setOriginalProfile(profile);
      setAvatarPreview(user.avatar || profile.avatar);
    }
  }, [data]);

  /* ---------------- UPDATE PROFILE ---------------- */

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      setIsEditMode(false);
      setOriginalProfile(profileData);
      setUserData(profileData);
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();

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
          >
            <div className="md:col-span-2 flex flex-col items-center gap-3">
              <IKContext
                publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                authenticator={authApi.authenticator}
              >
                <div
                  className={`relative  h-28 w-28 rounded-full border-2 border-base-300 overflow-hidden cursor-pointer
      ${!isEditMode ? "cursor-not-allowed opacity-80" : "hover:opacity-90"}
    `}
                >
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

                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100 transition">
                      Change
                    </div>
                  )}

                  {isEditMode && (
                    <IKUpload
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      folder="/AI_Assistant"
                      fileName={`avatar_${Date.now()}`}
                      onSuccess={(res) => {
                        setProfileData((prev) => ({
                          ...prev,
                          avatar: res.url, // ✅ STRING
                        }));
                        setAvatarPreview(res.url);
                      }}
                      onError={(err) => {
                        console.error("ImageKit upload error", err);
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
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              required
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
              onChange={(e) =>
                setProfileData({ ...profileData, grade: e.target.value })
              }
              options={[
                { label: "9", value: "9" },
                { label: "10", value: "10" },
                { label: "11", value: "11" },
                { label: "12", value: "12" },
                { label: "UG", value: "UG" },
                { label: "PG", value: "PG" },
              ]}
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
