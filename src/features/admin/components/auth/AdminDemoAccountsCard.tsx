import React from 'react';
import { useLanguage } from '@/shared';

interface AdminDemoAccountsCardProps {
  onQuickFill: (email: string, pass: string) => void;
}

export const AdminDemoAccountsCard: React.FC<AdminDemoAccountsCardProps> = ({ onQuickFill }) => {
  const { isRTL } = useLanguage();

  return (
    <div className="mt-8 pt-6 border-t border-zinc-800">
      <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
        <span>{isRTL ? 'حسابات الإدارة الجاهزة (Quick Fill):' : 'Pre-configured Staff Accounts:'}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onQuickFill('admin@eiffel.com', 'admin123')}
          className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left rtl:text-right transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">👑 Admin</span>
            <span className="text-[9px] text-zinc-500 font-mono">Full</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">admin@eiffel.com</p>
        </button>

        <button
          type="button"
          onClick={() => onQuickFill('staff@eiffel.com', 'staff123')}
          className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left rtl:text-right transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400">💼 Staff</span>
            <span className="text-[9px] text-zinc-500 font-mono">Ops</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">staff@eiffel.com</p>
        </button>
      </div>
    </div>
  );
};
