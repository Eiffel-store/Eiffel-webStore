import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStoreData, useLanguage } from '@/shared';
import { Product } from '@/types';
import { ProductFormBasicInfo } from '../components/product-form/ProductFormBasicInfo';
import { ProductFormColorsAndMedia } from '../components/product-form/ProductFormColorsAndMedia';
import { ProductFormDetails } from '../components/product-form/ProductFormDetails';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { products, addProduct, updateProduct } = useStoreData();
  const { isRTL, t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    subtitle: '',
    price: 0,
    originalPrice: undefined,
    category: 'men',
    subCategory: '',
    images: [''],
    colors: [],
    sizes: ['M', 'L', 'XL'],
    description: '',
    details: [],
    composition: '',
    fit: '',
    care: [],
    rating: 5.0,
    reviewCount: 0,
    stock: 0,
    inStock: true,
    isNew: false,
    isBestSeller: false,
    isLimited: false
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Populate data if editing
  useEffect(() => {
    if (id) {
      const existing = products.find(p => p.id === id);
      if (existing) {
        setFormData({
          name: existing.name,
          subtitle: existing.subtitle || '',
          price: existing.price,
          originalPrice: existing.originalPrice,
          category: existing.category,
          subCategory: existing.subCategory || '',
          images: existing.images && existing.images.length > 0 ? existing.images : [''],
          colors: existing.colors || [],
          sizes: existing.sizes || [],
          description: existing.description || '',
          details: existing.details || [],
          composition: existing.composition || '',
          fit: existing.fit || '',
          care: existing.care || [],
          rating: existing.rating !== undefined ? existing.rating : 5.0,
          reviewCount: existing.reviewCount !== undefined ? existing.reviewCount : 0,
          stock: existing.stock !== undefined ? existing.stock : (existing.inStock ? 1 : 0),
          inStock: existing.inStock !== false,
          isNew: existing.isNew || false,
          isBestSeller: existing.isBestSeller || false,
          isLimited: existing.isLimited || false
        });
      } else {
        setError(t.error);
      }
    }
  }, [id, products, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(t.adminProductNameRequired);
      return;
    }

    const cleanImages = formData.images.filter(img => img.trim() !== '');
    if (cleanImages.length === 0) {
      setError(t.adminProductImageRequired);
      return;
    }

    const payload = {
      ...formData,
      images: cleanImages
    };

    if (isEditing && id) {
      updateProduct(id, payload);
      const msg = t.adminProductUpdatedSuccess;
      setSuccessMessage(msg);
      toast.success(msg, { id: 'admin-prod-save' });
    } else {
      addProduct(payload);
      const msg = t.adminProductCreatedSuccess;
      setSuccessMessage(msg);
      toast.success(msg, { id: 'admin-prod-save' });
    }

    setTimeout(() => {
      navigate('/admin/products');
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
              {isEditing
                ? `${t.adminHeaderEditProduct}: ${formData.name || id}`
                : t.adminAddNewProduct}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {t.adminProductFormSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 rounded animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 rounded animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Basic Information */}
        <ProductFormBasicInfo
          formData={formData}
          onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        />

        {/* 2. Colors, Color-Specific Imagery & Sizes */}
        <ProductFormColorsAndMedia
          colors={formData.colors}
          images={formData.images}
          sizes={formData.sizes}
          onColorsChange={(colors) => setFormData(prev => ({ ...prev, colors }))}
          onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
          onSizesChange={(sizes) => setFormData(prev => ({ ...prev, sizes }))}
        />

        {/* 3. Specifications & Description */}
        <ProductFormDetails
          description={formData.description}
          composition={formData.composition || ''}
          fit={formData.fit || ''}
          details={formData.details || []}
          care={formData.care || []}
          onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        />

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Link
            to="/admin/products"
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
          >
            {t.cancel}
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? t.saveChanges : t.adminPublishProduct}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
