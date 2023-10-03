import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import router from "next/router";

import { Search } from "@/components/Icons/Icons";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void handleSearch();
  };
  const handleSearch = async () => {
    try {
      await router.push({
        pathname: "/SearchPage",
        query: { q: searchInput },
      });
    } catch (error) {
      console.log("Error searching:", error);
    }
  };
  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative ">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-50 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="search"
          name="search"
          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 "
          placeholder="Search"
          type="search"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />
      </div>
    </>
  );
};

export default SearchBar;
