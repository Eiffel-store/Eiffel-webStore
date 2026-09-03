import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import toast from 'react-hot-toast';

export const useProductsData = (queryClient: QueryClient) => {
  const { data: serverProducts = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().catch(() => []),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1
  });

  const products = Array.isArray(serverProducts) ? serverProducts : [];

  const createProductMutation = useMutation({
    mutationFn: (p: Partial<Product>) => productService.create(p),
    onSuccess: (newProd: Product) => {
      queryClient.setQueryData<Product[]>(['products'], (old: Product[] | undefined) => [
        newProd,
        ...(old || []).filter((p) => p.id !== newProd.id)
      ]);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('تمت إضافة المنتج بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل إضافة المنتج');
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      productService.update(id, updates),
    onSuccess: (updatedProd: Product) => {
      queryClient.setQueryData<Product[]>(['products'], (old: Product[] | undefined) =>
        (old || []).map((p: Product) => (p.id === updatedProd.id ? updatedProd : p))
      );
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (updatedProd?.id) {
        queryClient.invalidateQueries({ queryKey: ['product', updatedProd.id] });
      }
      try {
        const bc = new BroadcastChannel('eiffel-sync');
        bc.postMessage({
          type: 'STOCK_UPDATED',
          payload: {
            productId: updatedProd?.id,
            stock: updatedProd?.stock,
            inStock: updatedProd?.inStock,
          },
        });
        bc.close();
      } catch {
        // ignore
      }
      toast.success('تم تحديث المنتج بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل تحديث المنتج');
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const prevProducts = queryClient.getQueryData<Product[]>(['products']);
      if (prevProducts) {
        queryClient.setQueryData<Product[]>(
          ['products'],
          prevProducts.filter((p) => p.id !== id)
        );
      }
      return { prevProducts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('تم حذف المنتج نهائياً من قاعدة البيانات');
    },
    onError: (err: any, _id, context) => {
      if (context?.prevProducts) {
        queryClient.setQueryData(['products'], context.prevProducts);
      }
      toast.error(err?.message || 'فشل حذف المنتج');
    }
  });

  const addProduct = (p: Omit<Product, 'id'>) => {
    const tempId = `prod-${Date.now()}`;
    const newProduct: Product = { ...p, id: tempId };
    createProductMutation.mutate(newProduct);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    updateProductMutation.mutate({ id, updates });
  };

  const deleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const decrementStock = (id: string, quantity: number = 1) => {
    queryClient.setQueryData<Product[]>(['products'], (old: Product[] | undefined) => {
      if (!old) return [];
      return old.map((p: Product) => {
        if (p.id === id) {
          const current = p.stock !== undefined ? p.stock : 0;
          const updated = Math.max(0, current - quantity);
          return { ...p, stock: updated, inStock: updated > 0 };
        }
        return p;
      });
    });

    productService.adjustStock(id, -quantity).catch((err) => {
      console.warn('Backend stock decrement failed', err);
    });
  };

  const incrementStock = (id: string, quantity: number = 1) => {
    queryClient.setQueryData<Product[]>(['products'], (old: Product[] | undefined) => {
      if (!old) return [];
      return old.map((p: Product) => {
        if (p.id === id) {
          const current = p.stock !== undefined ? p.stock : 0;
          const updated = current + quantity;
          return { ...p, stock: updated, inStock: updated > 0 };
        }
        return p;
      });
    });

    productService.adjustStock(id, quantity).catch((err) => {
      console.warn('Backend stock increment failed', err);
    });
  };

  return {
    products,
    isProductsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    decrementStock,
    incrementStock
  };
};
