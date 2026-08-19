import React, { useState } from 'react';
import { StoreLocation } from '@/types';
import { useLanguage, useStoreData, EiffelLoader, EmptyState } from '@/shared';
import { StoreCard } from '../components/StoreCard';
import { StoreMapCanvas } from '../components/StoreMapCanvas';
import { AppointmentModal } from '../components/AppointmentModal';

export const StoreLocatorPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { stores, isLoading } = useStoreData();
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(stores[0] || {} as StoreLocation);
  const [appointmentModalStore, setAppointmentModalStore] = useState<StoreLocation | null>(null);

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-surface-container dark:border-zinc-800 gap-4">
          <div>
            <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.globalFlagships}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1 uppercase">
              {t.storeLocatorTitle}
            </h1>
          </div>
          <p className="text-xs text-secondary dark:text-zinc-400 max-w-md font-light">
            {t.storeLocatorDesc}
          </p>
        </div>

        {/* Loading / Empty / Content */}
        {isLoading ? (
          <div className="py-20">
            <EiffelLoader message={isRTL ? 'جاري تحميل مواقع فروع إيفل...' : 'Loading Eiffel boutique locations...'} />
          </div>
        ) : stores.length === 0 ? (
          <EmptyState
            title={isRTL ? 'لا توجد فروع مضافة حالياً' : 'No Stores Listed Currently'}
            description={isRTL ? 'خدمة التوصيل السريع والدفع عند الاستلام متاحة لكافة المحافظات المصرية عبر المتجر.' : 'Express courier delivery and Cash on Delivery are available nationwide.'}
            actionText={isRTL ? 'تصفح التشكيلة الآن' : 'Explore Collections'}
            actionLink="/collections/men"
          />
        ) : (
          /* Main Grid: Stores List & Simulated Interactive Map */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* Store Cards List (5 cols) */}
            <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-2 rtl:pr-0 rtl:pl-2">
              {stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isSelected={selectedStore.id === store.id}
                  onSelect={() => setSelectedStore(store)}
                  onBookAppointment={() => setAppointmentModalStore(store)}
                />
              ))}
            </div>

            {/* Simulated Interactive Map Canvas (7 cols) */}
            <StoreMapCanvas
              stores={stores}
              selectedStore={selectedStore.id ? selectedStore : stores[0]}
              onSelectStore={setSelectedStore}
              onScheduleFitting={() => setAppointmentModalStore(selectedStore.id ? selectedStore : stores[0])}
            />
          </div>
        )}
      </div>

      {/* Book Private Fitting Appointment Modal */}
      {appointmentModalStore && (
        <AppointmentModal
          store={appointmentModalStore}
          onClose={() => setAppointmentModalStore(null)}
        />
      )}
    </div>
  );
};
