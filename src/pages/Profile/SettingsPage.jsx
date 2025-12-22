import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdSettings } from "react-icons/md";
import PageHeader from "../../components/PageHeader";
import FormInput from "../../components/FormInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import AppModal from "../../components/AppModal";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ---------------- CHANGE PASSWORD ---------------- */

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      authApi.changePassword({
        currentPassword: password.current,
        newPassword: password.new,
      }),
    onSuccess: () => {
      setPassword({ current: "", new: "", confirm: "" });
      alert("Password changed successfully");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to change password");
    },
  });

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (password.new.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (password.new !== password.confirm) {
      return alert("Passwords do not match");
    }

    changePasswordMutation.mutate();
  };

  /* ---------------- CHANGE EMAIL ---------------- */

  const [newEmail, setNewEmail] = useState("");

  const changeEmailMutation = useMutation({
    mutationFn: () => authApi.changeEmail(newEmail),
    onSuccess: () => {
      alert("Verification email sent to new email address");
      setNewEmail("");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to send verification email");
    },
  });

  /* ---------------- DELETE ACCOUNT ---------------- */

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const deleteAccountMutation = useMutation({
    mutationFn: () => authApi.deleteAccount({ password: deletePassword }),
    onSuccess: () => {
      logout();
      navigate("/auth/login");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete account");
    },
  });

  return (
    <div>
      <PageHeader
        icon={MdSettings}
        title="Settings"
        content="Manage your account security and preferences"
      />

      <div className="space-y-8">
        {/* ================= CHANGE EMAIL ================= */}
        <section className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* LEFT CONTENT */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Change Email</h3>

              <p className="text-sm text-base-content/70">
                A verification link will be sent to your new email address.
              </p>
            </div>

            {/* RIGHT FORM */}
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="w-full">
                <FormInput
                  label="New Email Address"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <PrimaryButton
                onClick={() => changeEmailMutation.mutate()}
                loading={changeEmailMutation.isPending}
              >
                Send Verification
              </PrimaryButton>
            </div>
          </div>
        </section>

        {/* ================= CHANGE PASSWORD ================= */}
        <section className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-5 sm:p-8">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <form
            onSubmit={handleChangePassword}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            <FormInput
              label="Current Password"
              type="password"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
              required
            />

            <FormInput
              label="New Password"
              type="password"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
              required
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
              required
            />

            {/* Button row */}
            <div className="lg:col-span-3 flex justify-center pt-2">
              <PrimaryButton
                type="submit"
                loading={changePasswordMutation.isPending}
                className="btn btn-primary px-6 shadow-md hover:shadow-lg transition"
              >
                Update Password
              </PrimaryButton>
            </div>
          </form>
        </section>

        {/* ================= DANGER ZONE ================= */}
        <section className="rounded-2xl border border-error bg-error/5 p-5 lg:p-8">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-error mb-2">
                Danger Zone
              </h3>
              <p className="text-sm text-gray-700">
                Deleting your account will schedule it for permanent removal.
                Your account and all associated data will be permanently deleted
                after <strong>30 days</strong>.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                During this 30-day period, you can restore your account by
                attempting to log in with the same email address and submitting
                an account recovery request.
              </p>
            </div>

            <PrimaryButton
              className="btn btn-error"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </PrimaryButton>
          </div>
        </section>
      </div>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      <AppModal
        open={showDeleteModal}
        title="Delete Account"
        onClose={() => setShowDeleteModal(false)}
      >
        <p className="text-sm mb-4">
          Please enter your password to confirm account deletion.
        </p>

        <FormInput
          label="Password"
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="btn"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>

          <PrimaryButton
            className="btn btn-error"
            loading={deleteAccountMutation.isPending}
            onClick={() => deleteAccountMutation.mutate()}
          >
            Delete Permanently
          </PrimaryButton>
        </div>
      </AppModal>
    </div>
  );
}
