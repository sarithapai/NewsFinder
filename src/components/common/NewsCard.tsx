import { NormalizedArticle } from "@/lib/normalizeStories";

type NewsCardProps = {
  article: NormalizedArticle;
};

const NewsCard = ({ article }: NewsCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg flex flex-col">
      {article?.imageUrl && (
        <div className="relative w-full h-24">
          <img
            src={article?.imageUrl}
            alt={article?.title}
            // fill
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-4 flex flex-col justify-between h-full">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {article?.title}
        </h3>
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {article?.description || "No description available."}
        </p>
        {article?.publishedAt && (
          <p className="text-xs text-gray-500 mb-4">
            Published on {new Date(article?.publishedAt).toLocaleDateString()}
          </p>
        )}
        {article?.author && (
          <p className="text-xs text-gray-600 mb-4">By {article?.author}</p>
        )}
        <div className="mt-auto flex justify-between items-center">
          <a
            href={article?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Read more →
          </a>

          {article?.source && (
            <span className="text-xs text-white bg-gray-800 px-2 py-1 rounded">
              {article?.source}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
