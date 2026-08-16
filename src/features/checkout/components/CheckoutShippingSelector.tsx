import React from 'react';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';

interface CheckoutShippingSelectorProps {
  shippingMethod: 'express' | 'white-glove';
  setShippingMethod: (method: 'express' | 'white-glove') => void;
}

export const CheckoutShippingSelector: React.FC<CheckoutShippingSelectorProps> = ({
  shippingMethod,
  setShippingMethod,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between pb-2 border-b border-surface-container dark:border-zinc-800">
        <h3 className="font-editorial text-2xl text-primary dark:text-white uppercase">
          2. {t.stepShipping}
        </h3>
      </div>

      <div className="space-y-3">
        <label
          onClick={() => setShippingMethod('express')}
          className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
            shippingMethod === 'express'
              ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900'
              : 'border-surface-container dark:border-zinc-800 hover:border-secondary'
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="shippingMethod"
              checked={shippingMethod === 'express'}
              onChange={() => setShippingMethod('express')}
              className="mt-1 text-primary focus:ring-0"
            />
            <div>
              <h4 className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-white">
                {t.shippingPriorityTitle}
              </h4>
              <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5 font-light">
                {t.shippingPriorityDesc}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-green-600 dark:text-green-400">
            {t.complimentary}
          </span>
        </label>

        <label
          onClick={() => setShippingMethod('white-glove')}
          className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
            shippingMethod === 'white-glove'
              ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900'
              : 'border-surface-container dark:border-zinc-800 hover:border-secondary'
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="shippingMethod"
              checked={shippingMethod === 'white-glove'}
              onChange={() => setShippingMethod('white-glove')}
              className="mt-1 text-primary focus:ring-0"
            />
            <div>
              <h4 className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-white">
                {t.shippingWhiteGloveTitle}
              </h4>
              <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5 font-light">
                {t.shippingWhiteGloveDesc}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-primary dark:text-white">
            +{formatPrice(10)}
          </span>
        </label>
      </div>
    </div>
  );
};
