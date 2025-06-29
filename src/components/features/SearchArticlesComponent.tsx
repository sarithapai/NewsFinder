import { useState, useMemo, useEffect } from "react";
import NewsCard from "../common/NewsCard";
import { NormalizedArticle } from "@/lib/normalizeStories";
import HeaderComponent from "./HeaderComponent";

const SearchArticlesComponent = ({ searchQuery }: { searchQuery: string }) => {
  const [filteredArticles, setFilteredArticles] = useState<NormalizedArticle[]>(
    []
  );
  const [sourceFilter, setSourceFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredArticles(data);
        setLoading(false);
      });
  }, [searchQuery]);

  const availableSources = useMemo(() => {
    const sources = filteredArticles.map((a) => a.source).filter(Boolean);
    return Array.from(new Set(sources));
  }, [filteredArticles]);

  const filteredResults = useMemo(() => {
    console.log("filteredResults", sourceFilter, dateFilter);
    return filteredArticles.filter((article) => {
      const matchesSource = sourceFilter
        ? article.source === sourceFilter
        : true;
      const matchesDate = dateFilter
        ? article.publishedAt?.startsWith(dateFilter)
        : true;
      return matchesSource && matchesDate;
    });
  }, [filteredArticles, sourceFilter, dateFilter]);

  console.log("filteredResults", filteredResults);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderComponent />
      {loading && (
        <div className="text-center text-gray-500">Loading articles...</div>
      )}

      {!loading && filteredArticles.length === 0 && searchQuery && (
        <div className="text-center text-gray-500">
          No articles found. Please try a different search term.
        </div>
      )}
      {filteredArticles.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-2xl font-bold">Searched Stories</h2>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="">All Sources</option>
                {availableSources.map((source, idx) => (
                  <option key={idx} value={source}>
                    {source}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="p-2 border rounded"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <p>No articles match the selected filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchArticlesComponent;
