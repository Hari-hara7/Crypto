import { FC, useEffect, useState } from "react";
import { fetchNews } from "../services/api";
import { News } from "../services/types";

const NewsFeed: FC = () => {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const getNews = async () => {
      const data = await fetchNews();
      setNews(data.Data);
    };
    getNews();
  }, []);

  return (
    <div className="bg-secondary p-6 rounded shadow-lg">
      <h2 className="text-xl text-white font-bold mb-4">Latest News</h2>
      <ul className="space-y-4">
        {news.slice(0, 5).map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {item.title}
            </a>
            <p className="text-gray-300 text-sm">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed;
