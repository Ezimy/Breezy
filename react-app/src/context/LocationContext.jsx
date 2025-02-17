import { createContext, useState } from "react";

// Create the context
export const LocationContext = createContext();

// Create the provider component
export function LocationProvider({ children }) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("")

  return (
    <LocationContext.Provider value={{ city, setCity, state, setState}}>
      {children}
    </LocationContext.Provider>
  );
}