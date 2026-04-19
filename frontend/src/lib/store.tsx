/**
 * lib/store.tsx — Global state backed by the real backend API
 *
 * Auth state is persisted in localStorage (token + user).
 * Products, bills, and stats are fetched fresh from the API.
 */

import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from 'react';
import type { User, Product, Bill, BillItem } from './types';
import {
  apiLogin, apiRegister, apiGetMe, apiUpdateProfile, apiSetupProfile,
  apiGetProducts, apiAddProduct, apiUpdateProduct, apiDeleteProduct,
  apiGetBills, apiGetStats, apiSaveBill,
  type StatsResponse,
} from '../api/services';
import { getStoredLocale, translate, type Locale, type TranslationKey } from './i18n';

/* ─────────────── Context types ─────────────── */

interface StoreContextType {
  /* Auth */
  currentUser: User | null;
  authLoading: boolean;
  login: (uniqueId: string) => Promise<{ success: boolean; requiresProfileSetup?: boolean; error?: string }>;
  register: (userData: {
    name: string; age: string; email: string; mobile: string;
    shopName: string; gstNo: string; address: string; city: string;
    district: string; state: string; password: string;
  }) => Promise<{ success: boolean; uniqueId?: string; error?: string }>;
  logout: () => void;
  setupProfile: (data: {
    name: string; age: string; email: string; mobile: string;
    shopName: string; gstNo: string; address: string; city?: string;
    district?: string; state?: string;
  }) => Promise<User>;
  updateProfile: (data: Partial<User & { password?: string }>) => Promise<void>;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;

  /* Products */
  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  /* Current bill (client-side — not yet saved) */
  currentBillItems: BillItem[];
  addToBill: (product: Product, qty: number) => { success: boolean; error?: string };
  removeFromBill: (productId: string) => void;
  updateBillItemQty: (productId: string, qty: number) => void;
  clearBill: () => void;

  /* Bills (saved) */
  bills: Bill[];
  billsLoading: boolean;
  saveBill: (
    customerName: string, customerPhone: string, customerAddress: string,
    cgstPercent: number, sgstPercent: number,
  ) => Promise<Bill>;

  /* Stats */
  stats: StatsResponse | null;
  refreshStats: () => Promise<void>;
}

/* ─────────────── Helpers ─────────────── */

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('billcraft_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/* ─────────────── Context ─────────────── */

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser]           = useState<User | null>(getStoredUser);
  const [authLoading, setAuthLoading]           = useState(false);
  const [products, setProducts]                 = useState<Product[]>([]);
  const [productsLoading, setProductsLoading]   = useState(false);
  const [currentBillItems, setCurrentBillItems] = useState<BillItem[]>([]);
  const [bills, setBills]                       = useState<Bill[]>([]);
  const [billsLoading, setBillsLoading]         = useState(false);
  const [stats, setStats]                       = useState<StatsResponse | null>(null);
  const [locale, setLocaleState]                = useState<Locale>(getStoredLocale());

  /* ── Load data when user is set ── */
  useEffect(() => {
    if (!currentUser) {
      setProducts([]);
      setBills([]);
      setStats(null);
      setCurrentBillItems([]);
      return;
    }
    refreshProducts();
    refreshBills();
    refreshStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uniqueId]);

  /* ── Auth ── */
  const login = useCallback(async (uniqueId: string) => {
    try {
      setAuthLoading(true);
      const result = await apiLogin(uniqueId);
      localStorage.setItem('billcraft_token', result.token);
      localStorage.setItem('billcraft_user', JSON.stringify(result.user));
      setCurrentUser(result.user);
      return { success: true, requiresProfileSetup: result.requiresProfileSetup };
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error || 'Login failed.';
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: Parameters<StoreContextType['register']>[0]) => {
    if (!userData) {
      return { success: false, error: 'Registration is disabled. Contact admin for a Unique ID.' };
    }
    try {
      const result = await apiRegister(userData);
      return { success: true, uniqueId: result.uniqueId };
    } catch {
      return { success: false, error: 'Registration is disabled. Contact admin for a Unique ID.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('billcraft_token');
    localStorage.removeItem('billcraft_user');
    setCurrentUser(null);
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    localStorage.setItem('billcraft_locale', nextLocale);
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback((key: TranslationKey) => translate(key, locale), [locale]);

  const updateProfile = useCallback(async (data: Partial<User & { password?: string }>) => {
    const updated = await apiUpdateProfile(data);
    localStorage.setItem('billcraft_user', JSON.stringify(updated));
    setCurrentUser(updated);
  }, []);

  const setupProfile = useCallback(async (data: Parameters<StoreContextType['setupProfile']>[0]) => {
    const updated = await apiSetupProfile(data);
    localStorage.setItem('billcraft_user', JSON.stringify(updated));
    setCurrentUser(updated);
    return updated;
  }, []);

  /* ── Products ── */
  const refreshProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const p = await apiGetProducts();
      setProducts(p);
    } catch { /* handled by interceptor */ }
    finally { setProductsLoading(false); }
  }, []);

  const addProduct = useCallback(async (
    product: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ) => {
    const created = await apiAddProduct(product);
    setProducts(prev => [...prev, created]);
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    const updated = await apiUpdateProduct(id, data);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await apiDeleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  /* ── Current Bill (in-memory, not yet saved) ── */
  const addToBill = useCallback((product: Product, qty: number) => {
    let result = { success: false, error: '' };
    setCurrentBillItems((prev) => {
      const exists = prev.find(i => i.productId === product.id);
      if (exists) {
        result = { success: false, error: 'Product already added! Increase quantity below.' };
        return prev;
      }
      result = { success: true };
      return [...prev, {
        productId: product.id,
        name:      product.name,
        quantity:  qty,
        rate:      product.price,
        amount:    product.price * qty,
        unit:      product.unit,
        hsn:       product.hsn,
      }];
    });
    return result;
  }, []);

  const removeFromBill = useCallback((productId: string) => {
    setCurrentBillItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const updateBillItemQty = useCallback((productId: string, qty: number) => {
    setCurrentBillItems(prev => prev.map(i =>
      i.productId === productId ? { ...i, quantity: qty, amount: i.rate * qty } : i,
    ));
  }, []);

  const clearBill = useCallback(() => setCurrentBillItems([]), []);

  /* ── Bills (saved) ── */
  const refreshBills = useCallback(async () => {
    try {
      setBillsLoading(true);
      const b = await apiGetBills();
      setBills(b);
    } catch { /* handled */ }
    finally { setBillsLoading(false); }
  }, []);

  const saveBill = useCallback(async (
    customerName: string, customerPhone: string, customerAddress: string,
    cgstPercent: number, sgstPercent: number,
  ): Promise<Bill> => {
    return new Promise((resolve, reject) => {
      setCurrentBillItems((currentItems) => {
        const itemsToSave = [...currentItems];
        
        apiSaveBill({
          customerName, customerPhone, customerAddress,
          cgstPercent, sgstPercent, items: itemsToSave,
        })
          .then((bill) => {
            setBills(prev => [bill, ...prev]);
            setCurrentBillItems([]);
            refreshStats().catch(() => {});
            resolve(bill);
          })
          .catch((err) => {
            reject(err);
          });
        
        return currentItems;
      });
    });
  }, []);

  /* ── Stats ── */
  const refreshStats = useCallback(async () => {
    try {
      const s = await apiGetStats();
      setStats(s);
    } catch { /* handled */ }
  }, []);

  return (
    <StoreContext.Provider value={{
      currentUser, authLoading,
      login, register, logout, setupProfile, updateProfile,
      products, productsLoading, refreshProducts,
      addProduct, updateProduct, deleteProduct,
      currentBillItems, addToBill, removeFromBill,
      updateBillItemQty, clearBill,
      bills, billsLoading, saveBill,
      stats, refreshStats,
      locale, setLocale, t,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
