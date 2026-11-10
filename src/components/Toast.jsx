import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, type = "ok") => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, message, type }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="toasts">
        {items.map((t) => (
          <div key={t.id} className={"toast " + t.type}>
            {t.type === "ok" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
