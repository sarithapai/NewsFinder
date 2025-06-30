import { NextRequest, NextResponse } from "next/server";
import {
  normalizeGuardian,
  normalizeNewsAPI,
  normalizeNYT,
  NormalizedArticle,
} from "@/lib/normalizeStories";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const [newsAPIKey, guardianKey, nytKey] = [
    process.env.NEWSAPI_KEY,
    process.env.GUARDIAN_KEY,
    process.env.NYT_KEY,
  ];

  const rawPrefs = req.cookies.get("newsPreferences")?.value;
  const prefs = rawPrefs ? JSON.parse(decodeURIComponent(rawPrefs)) : {};
  const selectedSources: string[] = prefs.sources || [];

  try {
    const fetches: Promise<Response>[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizers: ((data: any) => NormalizedArticle[])[] = [];

    // --- NewsAPI ---
    if (selectedSources.length === 0 || selectedSources.includes("NewsAPI")) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&apiKey=${newsAPIKey}`;
      fetches.push(fetch(url));
      normalizers.push(normalizeNewsAPI);
    }

    // --- Guardian ---
    if (
      selectedSources.length === 0 ||
      selectedSources.includes("The Guardian")
    ) {
      const url = `https://content.guardianapis.com/search?q=${encodeURIComponent(
        query
      )}&apiKey=${guardianKey}`;
      fetches.push(fetch(url));
      normalizers.push(normalizeGuardian);
    }

    // --- NYTimes ---
    if (
      selectedSources.length === 0 ||
      selectedSources.includes("New York Times") ||
      selectedSources.includes("NYTimes")
    ) {
      const nytURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(
        query
      )}&api-key=${nytKey}`;

      fetches.push(fetch(nytURL));
      normalizers.push(normalizeNYT);
    }

    // Fetch and normalize
    const responses = await Promise.all(fetches);
    const jsonData = await Promise.all(responses.map((r) => r.json()));
    const articles = jsonData.flatMap((data, index) =>
      normalizers[index](data)
    );

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
