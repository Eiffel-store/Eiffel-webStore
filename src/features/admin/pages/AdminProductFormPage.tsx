import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
  Upload
} from 'lucide-react';
import { useStoreData } from '@/shared';
import { useLanguage } from '@/shared';
import { Product, ProductColor } from '@/types';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '39', '40', '41', '42', '43', '44', '45', 'One Size'];

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { products, addProduct, updateProduct, categories } = useStoreData();
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

  const [imageUrlInput, setImageUrlInput] = useState('');
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

  // Image Upload helper (converts to base64 DataURL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({
            ...prev,
            images: prev.images[0] === '' ? [reader.result as string] : [...prev.images, reader.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: prev.images[0] === '' ? [imageUrlInput.trim()] : [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const updated = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updated.length > 0 ? updated : [''] };
    });
  };

  const handleToggleSize = (size: string) => {
    setFormData(prev => {
      const exists = prev.sizes.includes(size);
      const updated = exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: updated };
    });
  };

  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: 'New Color', hex: '#333333' }]
    }));
  };

  const handleUpdateColor = (index: number, field: keyof ProductColor, value: string) => {
    setFormData(prev => {
      const updated = [...prev.colors];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, colors: updated };
    });
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError(isRTL ? 'يرجى إدخال اسم المنتج.' : 'Product name is required.');
      return;
    }

    if (formData.images.length === 0 || formData.images[0] === '') {
      setError(isRTL ? 'يرجى إضافة صورة واحدة على الأقل للمنتج.' : 'At least one image is required.');
      return;
    }

    if (isEditing && id) {
      updateProduct(id, formData);
      setSuccessMessage(isRTL ? 'تم حفظ تعديلات المنتج بنجاح!' : 'Product updated successfully!');
      setTimeout(() => navigate('/admin/products'), 800);
    } else {
      const created = addProduct(formData);
      setSuccessMessage(isRTL ? 'تمت إضافة المنتج الجديد بنجاح!' : 'New product created successfully!');
      setTimeout(() => navigate('/admin/products'), 800);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <Link
          to="/admin/products"
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRTL ? 'العودة لقائمة المنتجات' : 'Back to Catalog'}</span>
        </Link>

        <h1 className="text-lg sm:text-xl font-editorial font-bold text-white tracking-wide">
          {isEditing ? (isRTL ? 'تعديل المنتج' : 'Edit Product') : (isRTL ? 'إضافة منتج جديد' : 'New Product Entry')}
        </h1>
      </div>

      {/* Success / Error Alerts */}
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

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Product Information */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isRTL ? '1. البيانات الأساسية للمنتج' : '1. Basic Information'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                {isRTL ? 'اسم المنتج (الاسم المعروض)' : 'Product Name'} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isRTL ? 'مثال: تيشيرت إيفل بني أسيد ووش' : 'e.g. Eiffel Washed Cocoa Tee'}
                required
                className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                {isRTL ? 'العنوان الفرعي / الوصف القصير' : 'Subtitle / Tagline'}
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder={isRTL ? 'مثال: قطن مصري 100% غسيل عتيق' : 'e.g. Heavyweight Mineral Washed Cotton'}
                className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                {isRTL ? 'القسم الرئيسي (Category)' : 'Main Category'} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors"
              >
                <option value="men">{isRTL ? 'أزياء الرجال (Men)' : 'Men'}</option>
                <option value="kids">{isRTL ? 'أزياء الأطفال (Kids)' : 'Kids'}</option>
                <option value="accessories">{isRTL ? 'الإكسسوارات والساعات والشنط' : 'Accessories'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                {isRTL ? 'القسم الفرعي (Subcategory)' : 'Subcategory'}
              </label>
              <input
                type="text"
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                placeholder={isRTL ? 'مثال: T-Shirts / Polos / Hoodies / Watches' : 'e.g. T-Shirts / Polos / Hoodies'}
                className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
              {isRTL ? 'الوصف التفصيلي للمنتج' : 'Product Description'}
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isRTL ? 'اكتب وصفاً جذاباً للقطعة ومميزاتها...' : 'Detailed product description and styling advice...'}
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Pricing, Stock, and Offers */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
            <span className="text-amber-400 font-mono">EGP</span>
            <span>{isRTL ? '2. الأسعار وحالة التوفر والعروض' : '2. Pricing & Stock'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                {isRTL ? 'سعر البيع الحالي (ج.م)' : 'Selling Price (EGP)'} *
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono font-bold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                {isRTL ? 'السعر قبل الخصم (اختياري - للعروض)' : 'Original / Sale Strike Price'}
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={formData.originalPrice || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: e.target.value ? Number(e.target.value) : undefined
                  })
                }
                placeholder={isRTL ? 'مثال: 550 (ليظهر عليه خصم)' : 'e.g. 550 for discounted item'}
                className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                {isRTL ? 'حالة التوفر بالمخزون' : 'Stock Availability'}
              </label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                  className={`px-4 py-2 text-xs font-mono font-bold rounded transition-colors ${
                    formData.inStock
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                      : 'bg-red-950 border border-red-800 text-red-400'
                  }`}
                >
                  {formData.inStock ? (isRTL ? '✓ متوفر للطلب' : '✓ In Stock') : (isRTL ? '✕ نفد من المخزون' : '✕ Out of Stock')}
                </button>
              </div>
            </div>
          </div>

          {/* Badges Toggle */}
          <div className="pt-3 border-t border-zinc-800 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
              />
              <span>{isRTL ? 'وسم "وصل حديثاً" (New Arrival)' : 'New Arrival Badge'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
              />
              <span>{isRTL ? 'وسم "الأكثر مبيعاً" (Bestseller)' : 'Bestseller Badge'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isLimited}
                onChange={(e) => setFormData({ ...formData, isLimited: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
              />
              <span>{isRTL ? 'وسم "إصدار محدود" (Limited Edition)' : 'Limited Edition Badge'}</span>
            </label>
          </div>
        </div>

        {/* Section 3: Product Images */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <span>{isRTL ? '3. صور المنتج' : '3. Product Gallery Images'}</span>
          </h2>

          {/* Upload Input & URL input */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder={isRTL ? 'أدخل رابط الصورة (URL)...' : 'Enter image URL...'}
                  className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors shrink-0"
              >
                {isRTL ? 'إضافة الرابط' : 'Add URL'}
              </button>

              <label className="px-4 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0">
                <Upload className="w-4 h-4" />
                <span>{isRTL ? 'رفع من الجهاز' : 'Upload from Device'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Images Grid Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {formData.images.filter(img => Boolean(img)).map((imgUrl, index) => (
                <div key={index} className="relative group aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 rtl:left-auto rtl:right-1 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 uppercase">
                      {isRTL ? 'الرئيسية' : 'Cover'}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 rtl:right-auto rtl:left-1 p-1 bg-red-600/90 text-white rounded hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={isRTL ? 'حذف' : 'Remove'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Sizes and Colors */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
            <span>🎨</span>
            <span>{isRTL ? '4. المقاسات والألوان المتاحة' : '4. Sizes & Colors'}</span>
          </h2>

          {/* Sizes Checkboxes */}
          <div>
            <label className="block text-xs text-zinc-300 mb-2 font-bold">
              {isRTL ? 'المقاسات المتاحة للقطعة' : 'Available Sizes'}
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = formData.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleToggleSize(size)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold transition-colors ${
                      isSelected
                        ? 'bg-white text-black'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors List */}
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs text-zinc-300 font-bold">
                {isRTL ? 'الألوان المتاحة' : 'Available Colors'}
              </label>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRTL ? 'إضافة لون' : 'Add Color'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.colors.map((col, index) => (
                <div key={index} className="flex items-center gap-3 bg-zinc-900/60 p-2 border border-zinc-800">
                  <input
                    type="color"
                    value={col.hex}
                    onChange={(e) => handleUpdateColor(index, 'hex', e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) => handleUpdateColor(index, 'name', e.target.value)}
                    placeholder="Color name (e.g. Cocoa Brown)"
                    className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                  <input
                    type="text"
                    value={col.hex}
                    onChange={(e) => handleUpdateColor(index, 'hex', e.target.value)}
                    placeholder="#111111"
                    className="w-24 bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none"
                  />
                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="p-1 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Link
            to="/admin/products"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-label-bold uppercase tracking-widest transition-all shadow-xl"
          >
            {isEditing ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : (isRTL ? 'نشر المنتج الآن' : 'Publish Product')}
          </button>
        </div>
      </form>
    </div>
  );
};
