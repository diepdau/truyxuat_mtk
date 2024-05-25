// import React from "react";
// import "./Sidebar.css";
// import { Outlet } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// const queryClient = new QueryClient();
// export default function Main() {
//   return (
//     <main className="main">
//       <QueryClientProvider client={queryClient}>
//         <Outlet />
//       </QueryClientProvider>
//     </main>
//   );
// }
// Main.js
import React, { useContext } from "react";
import "./Sidebar.css";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarContext } from "./SidebarContext.js"; // Import SidebarContext

const queryClient = new QueryClient();

export default function Main() {
  const { isVisibleSidebar } = useContext(SidebarContext); // Use SidebarContext
  
  return (
    <main className={isVisibleSidebar ? "main with-sidebar" : "main full-width"}>
      <QueryClientProvider client={queryClient} >
        <Outlet />
      </QueryClientProvider>
    </main>
  );
}
