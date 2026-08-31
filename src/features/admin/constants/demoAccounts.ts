export interface AdminDemoAccount {
  roleAr: string;
  roleEn: string;
  scope: string;
  email: string;
  pass: string;
  badgeColor: string;
}

export const ADMIN_DEMO_ACCOUNTS: AdminDemoAccount[] = [
  {
    roleAr: '👑 مدير النظام',
    roleEn: '👑 Admin',
    scope: 'Full',
    email: 'admin@eiffel.com',
    pass: 'admin123',
    badgeColor: 'text-amber-400'
  },
  {
    roleAr: '💼 موظف متجر',
    roleEn: '💼 Staff',
    scope: 'Ops',
    email: 'staff@eiffel.com',
    pass: 'staff123',
    badgeColor: 'text-sky-400'
  }
];
