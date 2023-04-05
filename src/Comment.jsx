import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import DOMPurify from "dompurify";
import he from "he";

function Comment(props) {
  const { comment } = props;
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);

  const fetchReplies = async () => {
    try {
      const replyIds = comment.kids || [];
      const replyResponses = await Promise.all(
        replyIds.map((replyId) =>
          axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${replyId}.json`
          )
        )
      );
      const repliesData = replyResponses.map(
        (replyResponse) => replyResponse.data
      );
      setReplies(repliesData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (showReplies) {
      fetchReplies();
    }
  }, [showReplies]);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const decodedText = he.decode(
    DOMPurify.sanitize(comment.text, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })
  );

  return (
    <div
      className={`Comment ${
        comment.parent ? "nested-comment" : "root-comment"
      } ${replies.length > 0 ? "has-replies" : "no-replies"}`}
    >
      <p
        onClick={() => comment.kids && toggleReplies()}
        className={`${comment.kids ? "clickable" : ""}`}
      >
        <strong>{comment.by}: </strong>
        {decodedText}
      </p>
      {showReplies && (
        <ul>
          {replies.map((reply) => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comment;
