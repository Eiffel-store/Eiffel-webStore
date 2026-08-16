import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Plus,
  Trash2,
  Sparkles,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { Address, PaymentMethod } from '../types';

export const AccountPage: React.FC = () => {
  const { user, addAddress, deleteAddress, setDefaultAddress, addPaymentMethod, deletePaymentMethod } = useAuth();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'payments'>('overview');

  // Address modal form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState(user?.name.split(' ')[0] || '');
  const [newLastName, setNewLastName] = useState(user?.name.split(' ')[1] || '');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newCountry, setNewCountry] = useState('France');
  const [newPhone, setNewPhone] = useState(user?.phone || '');

  // Payment modal form
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');

  if (!user) return null;

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addr: Omit<Address, 'id'> = {
      type: 'Home',
      firstName: newFirstName,
      lastName: newLastName,
      street: newStreet,
      city: newCity,
      state: 'Île-de-France',
      postalCode: newPostal,
      country: newCountry,
      phone: newPhone,
      isDefault: user.addresses.length === 0
    };
    addAddress(addr);
    setShowAddressModal(false);
    setNewStreet('');
    setNewCity('');
    setNewPostal('');
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const card: Omit<PaymentMethod, 'id'> = {
      type: 'visa',
      cardNumber: newCardNumber || '•••• •••• •••• 8842',
      expiry: newCardExp || '12/28',
      cardholderName: newCardHolder || user.name,
      isDefault: user.paymentMethods.length === 0
    };
    addPaymentMethod(card);
    setShowCardModal(false);
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardHolder('');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header with Client Welcome & Privé Tier */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-surface-container dark:border-zinc-800 gap-6">
          <div>
            <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.clientDashboard}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1">
              {t.welcomeClient} {user.name.toUpperCase()}
            </h1>
          </div>

          <div className="flex items-center gap-4 p-4 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800">
            <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase">
                {t.membershipTier}
              </div>
              <div className="font-editorial text-xl text-primary dark:text-white">
                {user.tier}
              </div>
            </div>
            <div className="border-l rtl:border-l-0 rtl:border-r border-surface-container dark:border-zinc-800 pl-4 rtl:pl-0 rtl:pr-4">
              <div className="text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase">
                {t.privePoints}
              </div>
              <div className="font-mono text-sm font-bold text-primary dark:text-white">
                {user.tierPoints} PTS
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-surface-container dark:border-zinc-800 my-8 overflow-x-auto">
          {[
            { key: 'overview', label: t.tabOverview, icon: User },
            { key: 'orders', label: `${t.tabOrders} (${user.orders.length})`, icon: Package },
            { key: 'addresses', label: `${t.tabAddresses} (${user.addresses.length})`, icon: MapPin },
            { key: 'payments', label: `${t.tabPayments} (${user.paymentMethods.length})`, icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 px-4 text-xs font-label-bold tracking-wider uppercase flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-primary dark:border-white text-primary dark:text-white'
                    : 'border-transparent text-secondary dark:text-zinc-400 hover:text-primary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Bento Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
            {/* Recent Orders Preview */}
            <div className="md:col-span-8 p-6 sm:p-8 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-surface-container dark:border-zinc-800">
                <h3 className="font-editorial text-2xl text-primary dark:text-white">
                  {t.recentOrders}
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-label-bold text-secondary dark:text-zinc-400 hover:underline uppercase"
                >
                  {t.viewAllOrders}
                </button>
              </div>

              {user.orders.length === 0 ? (
                <p className="text-xs text-secondary py-8 text-center">{t.noOrdersYet}</p>
              ) : (
                <div className="space-y-4">
                  {user.orders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-xs font-bold text-primary dark:text-white">{order.id}</span>
                          <p className="text-[11px] text-secondary dark:text-zinc-400 font-mono mt-0.5">{order.date}</p>
                        </div>
                        <span className="text-[10px] font-label-bold px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 uppercase">
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        {order.items.map((it, idx) => (
                          <img
                            key={idx}
                            src={it.product.images[0]}
                            alt=""
                            className="w-12 h-14 object-cover bg-zinc-900 border border-surface-container"
                          />
                        ))}
                        <div className="flex-1 text-xs">
                          <p className="text-secondary dark:text-zinc-400 font-light">{order.items.length} {t.itemsReserved}</p>
                          <span className="font-mono font-bold text-primary dark:text-white">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="md:col-span-4 p-6 sm:p-8 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
              <h3 className="font-editorial text-2xl text-primary dark:text-white pb-4 border-b border-surface-container dark:border-zinc-800">
                {t.clientProfile}
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase">{t.firstNameLabel} & {t.lastNameLabel}</span>
                  <p className="font-medium text-primary dark:text-white">{user.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase">{t.emailLabel}</span>
                  <p className="font-mono text-primary dark:text-white">{user.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase">{t.phoneLabel}</span>
                  <p className="font-mono text-primary dark:text-white">{user.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-secondary uppercase">{t.memberSince}</span>
                  <p className="font-mono text-primary dark:text-white">{user.memberSince}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container dark:border-zinc-800">
                <h4 className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-white mb-2">
                  {t.exclusivePrivileges}
                </h4>
                <ul className="text-xs text-secondary dark:text-zinc-400 space-y-1.5 font-light">
                  <li>✓ {t.freeShippingUnlocked}</li>
                  <li>✓ {isRTL ? 'دعوات خاصة لعروض الأزياء' : 'Private runway previews'}</li>
                  <li>✓ {isRTL ? 'خدمة الخياطة والتعديل المجانية' : 'Complimentary bespoke adjustments'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container dark:border-zinc-800 gap-2">
                  <div>
                    <span className="font-mono text-sm font-bold text-primary dark:text-white">{order.id}</span>
                    <p className="text-xs font-mono text-secondary dark:text-zinc-400 mt-0.5">
                      {order.date} • {t.trackingId} <strong className="text-primary dark:text-white">{order.trackingNumber}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-label-bold px-3 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 uppercase">
                      {order.status}
                    </span>
                    <span className="font-mono text-base font-bold text-primary dark:text-white">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800">
                      <img src={it.product.images[0]} alt="" className="w-14 h-16 object-cover" />
                      <div className="flex-1">
                        <h4 className="font-editorial text-base text-primary dark:text-white line-clamp-1">{it.product.name}</h4>
                        <p className="text-[11px] text-secondary font-mono">{it.selectedSize} • {it.selectedColor}</p>
                        <span className="font-mono text-xs font-bold text-primary dark:text-white">{formatPrice(it.product.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-surface-container dark:border-zinc-800 flex justify-between items-center text-xs font-mono text-secondary">
                  <span>{t.destination} {order.shippingAddress.street}, {order.shippingAddress.city}</span>
                  <span className="flex items-center gap-1 text-primary dark:text-white">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{t.estimatedDelivery} {order.estimatedDelivery}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-editorial text-2xl text-primary dark:text-white">
                {t.savedAddressesTitle}
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="py-2 px-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-wider uppercase flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addNewAddress}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-secondary">{addr.id}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-label-bold px-2 py-0.5 bg-primary text-white dark:bg-white dark:text-black uppercase">
                          {t.defaultBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-primary dark:text-white">{addr.firstName} {addr.lastName}</p>
                    <p className="text-xs text-secondary dark:text-zinc-400">{addr.street}</p>
                    <p className="text-xs text-secondary dark:text-zinc-400">{addr.city}, {addr.postalCode} - {addr.country}</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-surface-container dark:border-zinc-800 flex justify-between items-center text-xs font-label-bold">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-secondary hover:text-primary dark:hover:text-white uppercase"
                      >
                        {t.setDefault}
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-error hover:underline uppercase flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t.delete}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Payment Methods */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-editorial text-2xl text-primary dark:text-white">
                {t.savedCardsTitle}
              </h3>
              <button
                onClick={() => setShowCardModal(true)}
                className="py-2 px-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-wider uppercase flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addNewCard}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-editorial text-lg text-primary dark:text-white uppercase">{pm.type}</span>
                      {pm.isDefault && (
                        <span className="text-[10px] font-label-bold px-2 py-0.5 bg-primary text-white dark:bg-white dark:text-black uppercase">
                          {t.defaultBadge}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-base font-bold text-primary dark:text-white tracking-widest">
                      {pm.cardNumber}
                    </p>
                    <div className="flex justify-between text-xs text-secondary font-mono">
                      <span>{pm.cardholderName}</span>
                      <span>{pm.expiry}</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-surface-container dark:border-zinc-800 flex justify-end">
                    <button
                      onClick={() => deletePaymentMethod(pm.id)}
                      className="text-xs font-label-bold text-error hover:underline uppercase flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t.delete}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative bg-surface-container-lowest dark:bg-zinc-950 p-6 sm:p-8 max-w-md w-full border border-surface-container dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in">
            <h3 className="font-editorial text-2xl text-primary dark:text-white">{t.addNewAddress}</h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.firstNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.lastNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.streetLabel}</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.cityLabel}</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.postalCodeLabel}</label>
                  <input
                    type="text"
                    required
                    value={newPostal}
                    onChange={(e) => setNewPostal(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs font-mono text-primary dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.countryLabel}</label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs text-primary dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.phoneLabel}</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs font-mono text-primary dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 border border-surface-container text-xs font-label-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs uppercase"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative bg-surface-container-lowest dark:bg-zinc-950 p-6 sm:p-8 max-w-md w-full border border-surface-container dark:border-zinc-800 shadow-2xl space-y-4 animate-fade-in">
            <h3 className="font-editorial text-2xl text-primary dark:text-white">{t.addNewCard}</h3>
            <form onSubmit={handleAddCardSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.cardNumberLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="4532 8821 9021 8842"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs font-mono text-primary dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.cardExpiryLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={newCardExp}
                    onChange={(e) => setNewCardExp(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs font-mono text-primary dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">{t.cardNameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="ALEXANDRE LAURENT"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container p-2.5 text-xs uppercase text-primary dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="flex-1 py-3 border border-surface-container text-xs font-label-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs uppercase"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
