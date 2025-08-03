import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

import { useDarkMode } from "../hooks/useDarkMode";
import { Moon, Sun } from "lucide-react";

// import { useDarkMode } from "../hooks/useDarkMode";

const Layout = () => {
  const navigate = useNavigate();

  const [sidebar, setSidebar] = useState(false);

  const [isDark, setIsDark] = useDarkMode();

  const { user } = useUser();

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img
          className="cursor-pointer w-32 sm:w-44"
          src={assets.logo}
          alt=""
          onClick={() => navigate("/")}
        />
        {/* Theme toggle button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="ml-4 text-gray-600 hover:text-primary transition"
          title="Toggle dark mode">
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>
      <div className="flex-1 w-full flex h-[calc(100vh-64px)] -mb-5">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1 bg-light-background">
          {/* <div className="flex-1 bg-[#F4F7FB] dark:bg-gray-900 dark:text-white transition-colors duration-300"> */}
          <Outlet context={{ isDark }} />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};
export default Layout;
