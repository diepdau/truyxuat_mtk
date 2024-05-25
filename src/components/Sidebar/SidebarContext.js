// SidebarContext.js
import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isVisibleSidebar, setIsVisibleSidebar] = useState(true);

  return (
    <SidebarContext.Provider value={{ isVisibleSidebar, setIsVisibleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
