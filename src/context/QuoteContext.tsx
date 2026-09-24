import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, tierFor, unitPriceFor, type Product } from "@/data/catalog";

export type QuoteLine = {
  productId: string;
  qty: number;
};

type QuoteContextValue = {
  lines: QuoteLine[];
  detailedLines: {
    product: Product;
    qty: number;
    unitPrice: number;
    listTotal: number;
    lineTotal: number;
    discount: number;
  }[];
  itemCount: number;
  unitCount: number;
  subtotal: number;
  listSubtotal: number;
  savings: number;
  lastAdded: string | null;
  addLine: (productId: string, qty: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<QuoteLine[]>([
    { productId: "titan18", qty: 10 },
    { productId: "profeed", qty: 12 },
  ]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addLine = useCallback((productId: string, qty: number) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { productId, qty }];
    });
    setLastAdded(findProduct(productId).name);
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId
          ? { ...l, qty: Math.max(findProduct(productId).moq, Math.min(999, qty)) }
          : l,
      ),
    );
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<QuoteContextValue>(() => {
    const detailedLines = lines.map((line) => {
      const product = findProduct(line.productId);
      const unitPrice = unitPriceFor(product, line.qty);
      return {
        product,
        qty: line.qty,
        unitPrice,
        listTotal: product.listPrice * line.qty,
        lineTotal: unitPrice * line.qty,
        discount: tierFor(product, line.qty).discount,
      };
    });

    const subtotal = detailedLines.reduce((sum, l) => sum + l.lineTotal, 0);
    const listSubtotal = detailedLines.reduce((sum, l) => sum + l.listTotal, 0);

    return {
      lines,
      detailedLines,
      itemCount: lines.length,
      unitCount: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal,
      listSubtotal,
      savings: listSubtotal - subtotal,
      lastAdded,
      addLine,
      setQty,
      removeLine,
      clear,
      drawerOpen,
      setDrawerOpen,
    };
  }, [lines, lastAdded, addLine, setQty, removeLine, clear, drawerOpen]);

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside a QuoteProvider");
  return ctx;
}
