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
import { useToast } from "../../components/ToastContext";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [errors, setErrors] = useState({});
  const [mailErrors, setMailErrors] = useState({});
  const navigate = useNavigate();
  const { showToast } = useToast();

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
    onSuccess: (response) => {
      setPassword({ current: "", new: "", confirm: "" });
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  const validatePassword = () => {
    const newErrors = {};

    if (!password.current) {
      newErrors.current = "Current password is required";
    }

    if (!password.new) {
      newErrors.new = "New password is required";
    } else if (password.new.length < 8) {
      newErrors.new = "Password must be at least 8 characters";
    } else if (!PASSWORD_REGEX.test(password.new)) {
      newErrors.new =
        "Password must contain at least one letter and one number";
    }

    if (!password.confirm) {
      newErrors.confirm = "Please confirm your password";
    } else if (password.new !== password.confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateEmail = () => {
    const newErrors = {};

    if (!newEmail.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(newEmail)) {
      newErrors.email = "Enter a valid email address";
    } else if (newEmail === useAuth().user?.email) {
      newErrors.email = "New email must be different from current email";
    }

    setMailErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    changePasswordMutation.mutate();
  };

  /* ---------------- CHANGE EMAIL ---------------- */

  const [newEmail, setNewEmail] = useState("");

  const changeEmailMutation = useMutation({
    mutationFn: () => authApi.changeEmail(newEmail),
    onSuccess: (response) => {
      setNewEmail("");
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  /* ---------------- DELETE ACCOUNT ---------------- */

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const deleteAccountMutation = useMutation({
    mutationFn: () => authApi.deleteAccount({ password: deletePassword }),
    onSuccess: (response) => {
      logout();
      navigate("/auth/login");
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
    },
    onError: (response) => {
      showToast(response.data.message, "error");
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
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="w-full">
                <FormInput
                  label="New Email Address"
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setMailErrors({ ...mailErrors, email: "" });
                  }}
                  error={mailErrors.email}
                />
              </div>

              <div className="mt-0 sm:mt-7">
                <PrimaryButton
                  onClick={() => {
                    if (!validateEmail()) return;
                    changeEmailMutation.mutate();
                  }}
                  loading={changeEmailMutation.isPending}
                >
                  Send Verification
                </PrimaryButton>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CHANGE PASSWORD ================= */}
        <section className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-5 sm:p-8">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <form
            onSubmit={handleChangePassword}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            noValidate
          >
            <FormInput
              label="Current Password"
              type="password"
              value={password.current}
              onChange={(e) => {
                setPassword({ ...password, current: e.target.value }),
                  setErrors({ ...errors, current: "" });
              }}
              required
              error={errors.current}
            />

            <FormInput
              label="New Password"
              type="password"
              value={password.new}
              onChange={(e) => {
                setPassword({ ...password, new: e.target.value }),
                  setErrors({ ...errors, new: "" });
              }}
              required
              error={errors.new}
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              value={password.confirm}
              onChange={(e) => {
                setPassword({ ...password, confirm: e.target.value }),
                  setErrors({ ...errors, confirm: "" });
              }}
              required
              error={errors.confirm}
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
              loading={deleteAccountMutation.isPending}
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
