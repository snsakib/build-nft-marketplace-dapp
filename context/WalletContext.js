"use client"; // Unusual statement, might be specific to the environment or tooling

// Importing necessary functions from the 'react' library
import { createContext, useState } from "react";

// Creating a new React context named 'WalletContext'
export const WalletContext = createContext();

// Creating a context provider component for managing the state of a wallet address
export const WalletProvider = ({ children }) => {
  // Initializing state variables using the 'useState' hook
  const [walletAddress, setWalletAddress] = useState(null);

  // Returning a 'WalletContext.Provider' with the 'value' prop set to the state and state-setting function
  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children} {/* Rendering the child components wrapped by 'WalletProvider' */}
    </WalletContext.Provider>
  );
};
