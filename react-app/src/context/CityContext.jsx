import { createContext, useState } from "react";

// Create the context
export const CityContext = createContext();

// Create the provider component
export function CityProvider({ children }) {
  const [city, setCity] = useState("");

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
}