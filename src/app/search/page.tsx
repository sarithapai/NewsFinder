import SearchArticlesComponent from "@/components/features/SearchArticlesComponent";
import { Suspense } from "react";

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchArticlesComponent />
    </Suspense>
  );
};

export default SearchPage;
