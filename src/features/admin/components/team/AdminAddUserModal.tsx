import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User as UserIcon, Phone, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';
import { adminService, AdminUserData } from '@/services/adminService';
import toast from 'react-hot-toast';

interface AdminAddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

export const AdminAddUserModal: React.FC<AdminAddUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
}) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<AdminUserData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'ROLE_STAFF',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password?.trim()) {
      setError(t.adminFillRequiredFields);
      return;
    }

    if ((formData.password || '').length < 6) {
      setError(t.adminPasswordMinLength);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await adminService.createUser(formData);
      toast.success(
        formData.role === 'ROLE_ADMIN'
          ? `${t.adminAccountCreatedSuccess} (Admin) 🎉`
          : `${t.adminAccountCreatedSuccess} (Staff) 🎉`
      );
      onUserCreated();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        t.adminAccountCreateFailed;
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 text-white shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-amber-400 uppercase">
            EIFFEL ACCESS CONTROL
          </span>
          <h2 className="font-editorial text-2xl text-white mt-1">
            {t.adminAddMember}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {t.adminAccountRoleDesc}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              {t.adminRole}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'ROLE_STAFF' })}
                className={`py-2 px-3 text-xs font-mono font-bold border transition-all text-center cursor-pointer ${
                  formData.role === 'ROLE_STAFF'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                💼 {t.adminRoleStaff}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'ROLE_ADMIN' })}
                className={`py-2 px-3 text-xs font-mono font-bold border transition-all text-center cursor-pointer ${
                  formData.role === 'ROLE_ADMIN'
                    ? 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                👑 {t.adminRoleAdmin}
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">
              {formData.role === 'ROLE_ADMIN'
                ? t.adminRoleFullAccessDesc
                : t.adminRoleOperationalDesc}
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              {t.fullName}
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mohamed Walied"
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              {t.emailAddress}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@eiffel.com"
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              {t.phone}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01012345678"
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              {t.adminInitialPassword}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-400 text-black font-label-bold text-xs tracking-widest uppercase hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-6 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.adminCreating}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{t.adminCreateAccountBtn}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
