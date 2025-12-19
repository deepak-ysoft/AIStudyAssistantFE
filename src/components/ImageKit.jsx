import { IKContext, IKUpload } from "imagekitio-react";

<IKContext
  publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
  urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
  authenticationEndpoint="/api/auth/imagekit-auth"
>
  <div
    className={`relative h-28 w-28 rounded-full border-2 border-base-300 overflow-hidden cursor-pointer
      ${!isEditMode ? "cursor-not-allowed opacity-80" : "hover:opacity-90"}
    `}
  >
    {avatarPreview ? (
      <img
        src={avatarPreview}
        alt="Avatar"
        className="h-full w-full object-cover"
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
        folder="/avatars"
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
</IKContext>;
