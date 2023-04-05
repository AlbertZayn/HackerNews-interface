import React, { useState, useEffect } from "react";
import axios from "axios";
import Comment from "./Comment";
import "./styles.css";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function NewsItem(props) {
  const { id } = props.match.params;
  const [newsItem, setNewsItem] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchNewsItem = async () => {
    try {
      const response = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      setNewsItem(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      const commentIds = response.data.kids || [];
      const commentResponses = await Promise.all(
        commentIds.map((commentId) =>
          axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
          )
        )
      );
      const commentsData = commentResponses.map(
        (commentResponse) => commentResponse.data
      );
      setComments(commentsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNewsItem();
    fetchComments();
  }, []);

  const handleRefresh = () => {
    setComments([]);
    fetchComments();
  };

  if (!newsItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="news-spire">
      <div className="news-note">
        <h2>
          <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
            {newsItem.title}
          </a>
        </h2>
        <p>
          <b>Author:</b> {newsItem.by}
        </p>
        <p>
          <b>Date:</b> {formatDate(newsItem.time * 1000)}
        </p>
        <p>
          <b>Number of comments:</b> {newsItem.descendants || 0}
        </p>
        <button className="newspage-btn" onClick={handleRefresh}>
          Refresh comments
        </button>
        <button
          className="newspage-btn"
          onClick={() => props.history.push("/")}
        >
          Back to top stories
        </button>
      </div>
      <div className="news-comments">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment?.id} comment={comment} />
          ))
        ) : (
          <div style={{ color: "#fff" }}>Loading comments...</div>
        )}
      </div>
    </div>
  );
}

export default NewsItem;
