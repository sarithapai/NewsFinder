"use client";

import { useState, useMemo, useEffect } from "react";
import NewsCard from "../common/NewsCard";
import { NormalizedArticle } from "@/lib/normalizeStories";
import HeaderComponent from "./HeaderComponent";
import { useSearchParams } from "next/navigation";

const SearchArticlesComponent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [filteredArticles, setFilteredArticles] = useState<NormalizedArticle[]>(
    []
  );
  const [sourceFilter, setSourceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
    if (filteredArticles.length === 0) return [];
    const sources = filteredArticles.map((a) => a?.source);
    return Array.from(new Set(sources));
  }, [filteredArticles]);

  const availableCategories = useMemo(() => {
    if (filteredArticles.length === 0) return [];

    const categoryKeywords = [
      "Technology",
      "Sports",
      "Politics",
      "Business",
      "Health",
      "Entertainment",
      "Science",
    ];

    const foundCategories = new Set<string>();

    filteredArticles.forEach((article) => {
      const text = `${article?.title} ${article?.description}`.toLowerCase();
      categoryKeywords.forEach((cat) => {
        if (text.includes(cat.toLowerCase())) {
          foundCategories.add(cat);
        }
      });
    });

    return Array.from(foundCategories);
  }, [filteredArticles]);

  const filteredResults = useMemo(() => {
    return filteredArticles.filter((article) => {
      const matchesSource = sourceFilter
        ? article?.source === sourceFilter
        : true;
      const matchesDate = dateFilter
        ? article?.publishedAt?.startsWith(dateFilter)
        : true;
      const matchesCategory = categoryFilter
        ? `${article?.title} ${article?.description}`
            .toLowerCase()
            .includes(categoryFilter.toLowerCase())
        : true;

      return matchesSource && matchesDate && matchesCategory;
    });
  }, [filteredArticles, sourceFilter, dateFilter, categoryFilter]);

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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold">Searched Stories</h2>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
              <select
                className="p-2 border rounded w-full sm:w-auto"
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
                className="p-2 border rounded w-full sm:w-auto"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />

              <select
                className="p-2 border rounded w-full sm:w-auto"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {availableCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
