import { createContext, useContext, useState } from "react";
import axios from "axios";
import { type AxiosResponse, AxiosError } from "axios";
import { useCallback } from "react";
import { type Method } from "axios";

type AllowedMethod = Extract<Method, "get" | "post" | "put" | "delete" | "patch">;

// Definire un tipo per il valore del context per maggiore chiarezza e sicurezza
interface ApiContextType {
  loading: boolean;
  error: { msg: string; details: AxiosError | null } | null; // Migliorato il tipo di errore
  result: any; // Potresti voler tipizzare meglio questo array in base ai dati che ti aspetti
  apiCall: (url: string, method: AllowedMethod, data?: any) => Promise<void>; // Aggiunto il parametro data e reso Promise<void>
}

// Inizializza il context con valori predefiniti che corrispondano all'interfaccia
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// 2. Enum per i Metodi HTTP

   
// 3. ApiProvider Component
export function ApiProvider({ children }: { children: React.ReactNode }) {
  // Spostare gli stati all'interno del componente ApiProvider
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ msg: string; details: AxiosError | null } | null>(null);
  const [result, setResult] = useState<any>({});

  // 4. Funzione apiCall
  // Usare useCallback per memoizzare la funzione e prevenire ricreazioni inutili
  const apiCall = useCallback(
    async (url: string, method: AllowedMethod, data?: any) => {
      setLoading(true);
      setError(null); // Resetta l'errore ad ogni nuova chiamata
      setResult([]);  // Resetta il risultato ad ogni nuova chiamata

      try {
        let response: AxiosResponse;

        switch (method.toLowerCase()) {
          case "get":
            response = await axios.get(url);
            break;
          case "post":
            response = await axios.post(url, data);
            break;
          case "put":
            response = await axios.put(url, data);
            break;
          case "patch":
            response = await axios.patch(url, data);
            break;
          case "delete":
            response = await axios.delete(url, { data }); // Body in delete
            break;
          default:
            throw new Error(`Metodo HTTP non supportato: ${method}`);
        }
        setResult(response.data);
      } catch (err: any) { // Cattura l'errore in modo più specifico
        if (axios.isAxiosError(err)) {
          setError({
            msg: `Errore nel caricamento dei dati con metodo ${method} all'endpoint ${url}.`,
            details: err,
          });
          console.error(`Axios Error:`, err.response?.data || err.message);
        } else {
          setError({
            msg: `Si è verificato un errore inaspettato.`,
            details: null,
          });
          console.error(`Unexpected Error:`, err);
        }
      } finally {
        setLoading(false);
      }
    },
    [] // Le dipendenze vuote significano che la funzione non cambierà mai
  );

  // 5. Valore fornito dal Context
  const contextValue = {
    loading,
    error,
    result,
    apiCall,
  };

  return (
  <ApiContext.Provider value={contextValue}>
    {children}
  </ApiContext.Provider>
);
}


// 6. Hook per usare il Context
export function useApiCall() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApiCall must be used within an ApiProvider");
  }
  return context;
}
