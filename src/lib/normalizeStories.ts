export type NormalizedArticle = {
  title: string;
  description: string;
  imageUrl?: string;
  source: string;
  url: string;
  publishedAt: string;
  author?: string;
};

type NewsAPIArticle = {
  title: string;
  description: string;
  urlToImage?: string;
  source: { name: string };
  url: string;
  publishedAt: string;
  author?: string;
};

type NewsAPIResponse = {
  articles: NewsAPIArticle[];
};

type GuardianArticle = {
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    trailText?: string;
    thumbnail?: string;
  };
  tags?: {
    webTitle: string;
  }[];
};

type GuardianResponse = {
  response: {
    results: GuardianArticle[];
  };
};

type NYTMultimedia = {
  url: string;
};

type NYTArticle = {
  headline?: { main: string };
  title?: string;
  abstract?: string;
  lead_paragraph?: string;
  multimedia?: NYTMultimedia[];
  web_url?: string;
  url?: string;
  pub_date?: string;
  published_date?: string;
  byline?: { original?: string };
};

type NYTResponse = {
  response?: {
    docs: NYTArticle[];
  };
  results?: NYTArticle[];
};

export function normalizeNewsAPI(data: NewsAPIResponse): NormalizedArticle[] {
  return data.articles?.map((item) => ({
    title: item.title,
    description: item.description,
    imageUrl: item.urlToImage,
    source: item.source.name,
    url: item.url,
    publishedAt: item.publishedAt,
    author: item.author || "",
  }));
}

export function normalizeGuardian(data: GuardianResponse): NormalizedArticle[] {
  return data?.response?.results?.map((item) => ({
    title: item.webTitle,
    description: item.fields?.trailText || "",
    imageUrl: item.fields?.thumbnail,
    source: "The Guardian",
    url: item.webUrl,
    publishedAt: item.webPublicationDate,
    author: item.tags?.[0]?.webTitle || "",
  }));
}

export function normalizeNYT(data: NYTResponse): NormalizedArticle[] {
  const results = data.response?.docs || data.results || [];

  return results.map((item) => ({
    title: item.headline?.main || item.title || "",
    description: item.abstract || item.lead_paragraph || "",
    imageUrl: item.multimedia?.[0]
      ? `https://www.nytimes.com/${item.multimedia[0].url}`
      : undefined,
    source: "New York Times",
    url: item.web_url || item.url || "",
    publishedAt: item.pub_date || item.published_date || "",
    author: item.byline?.original?.replace(/^By\s+/i, "") || "",
  }));
}
