import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import React from "react";

export default function Header() {
  const { user } = useContext(UserContext);

  return (
    <header className="pl-8 pr-8 pb-4 flex  justify-between mt-4">
      {/* Logo */}
      <a href="/" className="flex items-center gap-1 text-primary">
        <span className="font-bold text-2xl text-gray-800">QuesGen</span>
      </a>

      {/* Search Bar */}
      <div className="  searchBar md:flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md hidden">
        <div>Keyword</div>
        <div className="border-l border-l-gray-500"></div>
        <div>Context</div>
        <div className="border-l border-l-gray-500"></div>
        <div>Category</div>
      </div>

      {/* User Profile Section */}
      <Link
        to={user ? "/account" : "/login"}
        className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 items-center"
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {user ? <div className="text-sm md:text-base">{user.name}</div> : ""}
      </Link>
    </header>
  );
}
