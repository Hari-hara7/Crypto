import { FC, useEffect, useState } from "react";
import { fetchNews } from "../services/api";
import { News } from "../services/types";

const News: FC = () => {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const getNews = async () => {
      const data = await fetchNews();
      setNews(data.Data);
    };
    getNews();
  }, []);

  return (
    <main className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency News</h1>
      <ul>
        {news.map((item) => (
          <li key={item.id} className="mb-4">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {item.title}
            </a>
            <p className="text-gray-300">{item.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default News;
