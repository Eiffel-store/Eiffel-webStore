import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Crown,
  Briefcase
} from 'lucide-react';
import { useLanguage, EiffelLoader, EmptyState } from '@/shared';
import { adminService } from '@/services/adminService';
import { useAuthStore } from '@/stores/useAuthStore';
import { AdminAddUserModal } from './AdminAddUserModal';
import toast from 'react-hot-toast';

export const AdminTeamTab: React.FC = () => {
  const { t } = useLanguage();
  const { user: currentUser } = useAuthStore();

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers();
      // Filter for administrative team (Admin & Staff) or all
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load team users:', err);
      toast.error(t.adminTeamLoadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setRoleUpdatingId(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(
        newRole === 'ROLE_ADMIN'
          ? `${t.adminRoleUpdatedSuccess} (Admin 👑)`
          : `${t.adminRoleUpdatedSuccess} (Staff 💼)`
      );
    } catch (err: any) {
      toast.error(t.adminRoleUpdateFailed);
    } finally {
      setRoleUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (user.email === currentUser?.email) {
      toast.error(t.adminCannotDeleteSelf);
      return;
    }

    try {
      await adminService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success(t.adminUserDeletedSuccess);
    } catch (err: any) {
      toast.error(t.adminUserDeleteFailed);
    }
  };

  // Filter staff and admins
  const teamUsers = users.filter(
    (u) => u.role === 'ROLE_ADMIN' || u.role === 'ROLE_STAFF'
  );

  const filteredTeam = teamUsers.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-4 border border-zinc-800 rounded-lg">
        <div>
          <h2 className="text-lg font-editorial font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>{t.adminTeamAndStaffTab}</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminTeamPrivilegesDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded text-xs transition-colors cursor-pointer"
            title={t.refresh}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-label-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg cursor-pointer rounded"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.adminAddMember}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.adminSearchTeamPlaceholder}
          className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors rounded"
        />
      </div>

      {/* Users Table / Grid */}
      {isLoading ? (
        <div className="py-16">
          <EiffelLoader message={t.loading} />
        </div>
      ) : filteredTeam.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={t.adminNoTeamMembersFound}
          description={t.adminNoTeamMembersFoundDesc}
        />
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-lg bg-zinc-950">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">{t.adminTeamMemberHeader}</th>
                <th className="py-3.5 px-4">{t.adminTeamContactHeader}</th>
                <th className="py-3.5 px-4">{t.adminTeamRoleHeader}</th>
                <th className="py-3.5 px-4">{t.adminTeamCreatedHeader}</th>
                <th className="py-3.5 px-4 text-center">{t.adminProductTableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredTeam.map((user) => {
                const isAdmin = user.role === 'ROLE_ADMIN';
                const isCurrentSelf = user.email === currentUser?.email;

                return (
                  <tr key={user.id} className="hover:bg-zinc-900/30 transition-colors">
                    {/* User Identity */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                          isAdmin
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {isAdmin ? <Crown className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{user.name || 'Admin User'}</span>
                            {isCurrentSelf && (
                              <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[9px] font-mono rounded">
                                {t.adminYouCurrentAccount}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            ID: {String(user.id).slice(-8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px]">
                          <Mail className="w-3 h-3 text-zinc-500" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role Badge & Selector */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          disabled={roleUpdatingId === user.id || isCurrentSelf}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`px-2.5 py-1 text-xs font-mono font-bold rounded border cursor-pointer transition-colors ${
                            isAdmin
                              ? 'bg-red-500/10 border-red-500/30 text-red-400 focus:border-red-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 focus:border-amber-400'
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          <option value="ROLE_ADMIN" className="bg-zinc-900 text-white">
                            👑 {t.adminRoleAdmin}
                          </option>
                          <option value="ROLE_STAFF" className="bg-zinc-900 text-white">
                            💼 {t.adminRoleStaff}
                          </option>
                        </select>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 font-mono text-[11px] text-zinc-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : '2026'}
                    </td>

                    {/* Delete Action */}
                    <td className="py-4 px-4 text-center">
                      {!isCurrentSelf ? (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-600 font-mono">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      <AdminAddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserCreated={fetchUsers}
      />
    </div>
  );
};
