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
      <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-24 py-4 sm:py-0 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <Logo />
        </div>

        <div className="w-full sm:max-w-md flex justify-end">
          <SearchBar
            value={searchQuery}
            onChange={(text: string) => setSearchQuery(text)}
            onSearchEnter={() =>
              router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
            }
          />
          <button
            onClick={() => setShowModal(true)}
            className="ml-2 p-2 rounded hover:bg-gray-200 transition"
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
