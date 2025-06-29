"use client";

import SearchArticlesComponent from "@/components/features/SearchArticlesComponent";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return <SearchArticlesComponent searchQuery={query} />;
};

export default SearchPage;
