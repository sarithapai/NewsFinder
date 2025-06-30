import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  normalizeNewsAPI,
  normalizeGuardian,
  normalizeNYT,
  NormalizedArticle,
} from "@/lib/normalizeStories";

export async function GET(request: Request) {
  const [newsAPIKey, guardianKey, nytKey] = [
    process.env.NEWSAPI_KEY,
    process.env.GUARDIAN_KEY,
    process.env.NYT_KEY,
  ];

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const cookieStore = await cookies();
  const rawPrefs = cookieStore.get("newsPreferences")?.value;
  const prefs = rawPrefs ? JSON.parse(decodeURIComponent(rawPrefs)) : {};
  const selectedSources: string[] = prefs.sources || [];

  try {
    const fetchPromises: Promise<Response>[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizers: ((data: any) => NormalizedArticle[])[] = [];

    if (selectedSources.length === 0 || selectedSources.includes("NewsAPI")) {
      fetchPromises.push(
        fetch(
          `https://newsapi.org/v2/top-headlines?country=us&page=${page}&pageSize=${limit}&apiKey=${newsAPIKey}`
        )
      );
      normalizers.push(normalizeNewsAPI);
    }

    if (
      selectedSources.length === 0 ||
      selectedSources.includes("The Guardian")
    ) {
      fetchPromises.push(
        fetch(
          `https://content.guardianapis.com/search?show-fields=thumbnail,trailText&page=${page}&page-size=${limit}&api-key=${guardianKey}`
        )
      );
      normalizers.push(normalizeGuardian);
    }

    if (
      selectedSources.length === 0 ||
      selectedSources.includes("NYTimes") ||
      selectedSources.includes("New York Times")
    ) {
      fetchPromises.push(
        fetch(
          `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${nytKey}`
        )
      );
      normalizers.push(normalizeNYT);
    }

    const responses = await Promise.all(fetchPromises);
    const jsonData = await Promise.all(responses.map((res) => res.json()));
    const allArticles: NormalizedArticle[] = jsonData.flatMap((data, idx) =>
      normalizers[idx](data)
    );
    return NextResponse.json(allArticles);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch top stories" },
      { status: 500 }
    );
  }
}
