"use client";

import Logo from "@/components/common/Logo";
import SearchBar from "@/components/common/SearchBar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PreferenceModal from "@/components/common/PreferenceModal";
import Image from "next/image";

const HeaderComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  return (
    <header className="w-full bg-gray-100 shadow mb-6 px-4 sm:px-6">
      <div className="flex flex-wrap justify-between items-center py-4 gap-4">
        {/* Logo */}
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
          <Logo />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          {/* SearchBar with max width */}
          <div className="flex-grow min-w-0">
            <SearchBar
              value={searchQuery}
              onChange={(text: string) => setSearchQuery(text)}
              onSearchEnter={() =>
                router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
              }
            />
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex-shrink-0 p-2 rounded hover:bg-gray-200 transition"
            aria-label="Customize Feed"
          >
            <Image
              src="/settings.svg"
              alt="Settings"
              width={24}
              height={24}
              className="text-gray-700"
            />
          </button>
        </div>
      </div>

      {showModal && <PreferenceModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default HeaderComponent;
