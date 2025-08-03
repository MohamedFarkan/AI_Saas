import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
      <img
        src={assets.logo}
        alt="Logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate("/")}
      />
      {user ? (
        <UserButton /> //if user logged in, show user button, else show sign in button
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full bg-primary text-white px-10 py-2.5 cursor-pointer hover:bg-primary/80 transition-all duration-300">
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
export default Navbar;
