"use client";

import { Plus, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useCallback, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "@/utils/firebase/config";
import { useRouter } from "next/navigation";
// import { signOut } from "firebase/auth";

const Header = () => {
  //   const [user] = useAuthState(auth);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const [loading, setLoading] = useState(true);
  // console.log("user:-", user);

  // const handleSignOut = useCallback(() => {
  //   signOut(auth);
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("authToken");
  //   router.push("/"); // Redirect to sign-in after logout
  // }, [router]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown state
  };

  const handleOutsideClick = useCallback((event) => {
    if (event.target.closest(".dropdown-container")) return; // If clicked inside dropdown, ignore
    setIsDropdownOpen(false); // Close dropdown when clicking outside
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div className=" text-sm fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-white px-6 py-2 transition-all delay-200 border shadow-md">
      {/* Navigation Links */}

      {/* Logo */}
      <div className="flex items-center">
        <div
          className="cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <h1 className="hover:scale-125 transition-all duration-700 ease-in-out font-bold text-4xl text-orange-500 font-serif">
            A
          </h1>
        </div>
      </div>

      {/* User / Login Button */}
      <div className="flex gap-3 items-center">
        <button
          // onClick={handleAddListing}
          className="shadow-black shadow-lg hover:shadow-teal-300 flex items-center gap-1 px-3 py-2 text-black bg-teal-400 hover:text-white rounded-full hover:bg-teal-500 transition duration-700 ease-in-out"
          aria-label="Post Your Ad"
        >
          <Plus /> Post Your Ad
        </button>

        {/* {user ? ( */}
        <div className="relative dropdown-container">
          {/* User Button */}
          <button
            onClick={toggleDropdown}
            className="shadow-black shadow-lg rounded-full hover:shadow-teal-300 px-3 py-2 border-green-600 hover:bg-black hover:text-teal-400 flex items-center transition-all duration-700 ease-in-out"
          >
            <User />
            {/* {user.displayName || "User"} */}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              onClick={toggleDropdown}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-30"
            >
              <Link
                href="/user"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                My Profile
              </Link>
              <Link
                href="/myListings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                My Listings
              </Link>
              <Link
                href="/my-reservations"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                My Reservations
              </Link>
              <button
                // onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {/* ) : ( */}
        {/* <button
          onClick={() => router.push("/sign-in")}
          className="shadow-black shadow-lg hover:shadow-teal-300 px-3 py-2 border-green-600 rounded-lg hover:bg-black hover:text-teal-400"
          aria-label="Login"
        >
          Login
        </button> */}
        {/* )} */}
      </div>
    </div>
  );
};

export default Header;
