import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { Link } from "react-router-dom";

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year}   ${hours}:${minutes}`;
}

function Home() {
  const [topStories, setTopStories] = useState([]);

  const fetchTopStories = async () => {
    try {
      const response = await axios.get(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
      );
      const topHundred = response.data.slice(0, 100);
      const stories = await Promise.all(
        topHundred.map(async (id) => {
          const storyResponse = await axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          return storyResponse.data;
        })
      );
      setTopStories(stories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopStories();

    const interval = setInterval(fetchTopStories, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setTopStories([]);
    fetchTopStories();
  };

  return (
    <div>
      <div className="glassmorph">
        <div className="spire">
          <h1>
            Top 100 Stories on{" "}
            <span className="glitch" data-glitch="Hacker">
              Hacker
            </span>{" "}
            News{" "}
            <button className="refresh-btn" onClick={handleRefresh}>
              Refresh
            </button>
          </h1>
        </div>
        <div className="notes">
          {topStories.map((story) => (
            <div className="note" key={story?.id}>
              <Link to={`/news/${story?.id}`}>
                <h3>{story?.title}</h3>
              </Link>
              <p>
                <b>Rating</b>: {story?.score}
              </p>
              <p>
                <b>Author</b>: {story?.by}
              </p>
              <p>
                <b>Date</b>: {formatDate(story?.time)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
