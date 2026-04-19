import { useEffect, useState } from "react";
import { store } from "./mockStore";

export function useRequests() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const handler = () => setVersion((v) => v + 1);
    window.addEventListener("ccp:requests:update", handler);
    return () => window.removeEventListener("ccp:requests:update", handler);
  }, []);
  return { all: store.list(), version, store };
}
