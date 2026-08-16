import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface SizeGuideModalProps {
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative bg-surface-container-lowest dark:bg-zinc-950 w-full max-w-2xl p-6 sm:p-8 border border-surface-container dark:border-zinc-800 shadow-2xl z-10 animate-fade-in">
        <div className="flex justify-between items-center pb-4 border-b border-surface-container dark:border-zinc-800">
          <h3 className="font-editorial text-2xl text-primary dark:text-white">
            {t.measurementMatrix}
          </h3>
          <button onClick={onClose} className="text-primary dark:text-white p-1">
            ✕
          </button>
        </div>

        <div className="py-6 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left rtl:text-right">
            <thead>
              <tr className="border-b border-surface-container dark:border-zinc-800 text-secondary dark:text-zinc-400">
                <th className="py-2">{t.size}</th>
                <th className="py-2">CHEST / الصدر (CM)</th>
                <th className="py-2">SHOULDER / الأكتاف (CM)</th>
                <th className="py-2">LENGTH / الطول (CM)</th>
                <th className="py-2">SLEEVE / الأكمام (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/60 dark:divide-zinc-800 text-primary dark:text-zinc-200">
              <tr><td className="py-2.5 font-bold">XS</td><td>110</td><td>54</td><td>71</td><td>24</td></tr>
              <tr><td className="py-2.5 font-bold">S</td><td>116</td><td>56</td><td>73</td><td>25</td></tr>
              <tr><td className="py-2.5 font-bold">M</td><td>122</td><td>58</td><td>75</td><td>26</td></tr>
              <tr><td className="py-2.5 font-bold">L</td><td>128</td><td>60</td><td>77</td><td>27</td></tr>
              <tr><td className="py-2.5 font-bold">XL</td><td>134</td><td>62</td><td>79</td><td>28</td></tr>
              <tr><td className="py-2.5 font-bold">XXL</td><td>140</td><td>64</td><td>81</td><td>29</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-secondary dark:text-zinc-400 font-light">
          {t.measurementsFlatNotice}
        </p>
      </div>
    </div>
  );
};
