import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';
import { Product } from '@/types';
import { ProductFormBasicInfo } from '../components/product-form/ProductFormBasicInfo';
import { ProductFormMedia } from '../components/product-form/ProductFormMedia';
import { ProductFormVariants } from '../components/product-form/ProductFormVariants';
import { ProductFormDetails } from '../components/product-form/ProductFormDetails';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { products, addProduct, updateProduct } = useStoreData();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    subtitle: '',
    price: 350,
    originalPrice: undefined,
    category: 'men',
    subCategory: 'T-Shirts',
    images: [''],
    colors: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Chalk White', hex: '#F9F9F9' }
    ],
    sizes: ['M', 'L', 'XL'],
    description: '',
    details: ['100% Heavyweight Egyptian Cotton', 'Precision tailored fit', 'Made in Egypt'],
    composition: '100% Cotton (280 GSM)',
    fit: 'Relaxed Drop-Shoulder',
    care: ['Machine wash cold', 'Do not bleach', 'Iron on low'],
    rating: 5.0,
    reviewCount: 12,
    inStock: true,
    isNew: true,
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
          images: existing.images.length > 0 ? existing.images : [''],
          colors: existing.colors.length > 0 ? existing.colors : [{ name: 'Black', hex: '#000000' }],
          sizes: existing.sizes || ['M', 'L', 'XL'],
          description: existing.description || '',
          details: existing.details || [],
          composition: existing.composition || '',
          fit: existing.fit || '',
          care: existing.care || [],
          rating: existing.rating || 5.0,
          reviewCount: existing.reviewCount || 10,
          inStock: existing.inStock !== false,
          isNew: existing.isNew || false,
          isBestSeller: existing.isBestSeller || false,
          isLimited: existing.isLimited || false
        });
      } else {
        setError(isRTL ? 'المنتج غير موجود' : 'Product not found');
      }
    }
  }, [id, products, isRTL]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(isRTL ? 'يرجى إدخال اسم المنتج.' : 'Product name is required.');
      return;
    }

    const cleanImages = formData.images.filter(img => img.trim() !== '');
    if (cleanImages.length === 0) {
      setError(isRTL ? 'يرجى إضافة صورة واحدة على الأقل للمنتج.' : 'At least one product image is required.');
      return;
    }

    const payload = {
      ...formData,
      images: cleanImages
    };

    if (isEditing && id) {
      updateProduct(id, payload);
      setSuccessMessage(isRTL ? 'تم تحديث المنتج بنجاح!' : 'Product updated successfully!');
    } else {
      addProduct(payload);
      setSuccessMessage(isRTL ? 'تمت إضافة المنتج للكتالوج بنجاح!' : 'New product created successfully!');
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
                ? (isRTL ? `تعديل المنتج: ${formData.name || id}` : `Edit Product: ${formData.name || id}`)
                : (isRTL ? 'إضافة منتج جديد للكتالوج' : 'Add New Product')}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isRTL
                ? 'أدخل بيانات القطعة والصور والأسعار لتظهر فوراً في المتجر.'
                : 'Fill in garment details, imagery, sizing and pricing.'}
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

        {/* 2. Media Gallery */}
        <ProductFormMedia
          images={formData.images}
          onChange={(images) => setFormData(prev => ({ ...prev, images }))}
        />

        {/* 3. Variants (Colors & Sizes) */}
        <ProductFormVariants
          colors={formData.colors}
          sizes={formData.sizes}
          onColorsChange={(colors) => setFormData(prev => ({ ...prev, colors }))}
          onSizesChange={(sizes) => setFormData(prev => ({ ...prev, sizes }))}
        />

        {/* 4. Specifications & Description */}
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
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : (isRTL ? 'نشر المنتج الآن' : 'Publish Product')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
