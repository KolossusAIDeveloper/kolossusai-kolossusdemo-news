import React, { useState } from 'react';
import './ArticleDetail.css';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%232a2d45'/%3E%3Ctext x='400' y='220' text-anchor='middle' fill='%23606880' font-size='72'%3E📰%3C/text%3E%3C/svg%3E";

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function ArticleDetail({ article, onBack }) {
  const [imgError, setImgError] = useState(false);

  return (
    <main className="detail-page">
      <div className="detail-inner">
        <button className="back-btn" onClick={onBack} aria-label="Back to news feed">
          ← Back to Feed
        </button>
        <article className="detail-article">
          <div className="detail-meta-top">
            <span className="detail-category">{article.category}</span>
            <span className="detail-date">{formatDate(article.pubDate)}</span>
          </div>
          <h1 className="detail-title">{article.title}</h1>
          <div className="detail-sources">
            <span className="detail-sources-label">Sources:</span>
            {article.sources.map((s, i) => (
              <span key={i} className="source-tag">{s}</span>
            ))}
          </div>
          <img
            src={!imgError && article.image ? article.image : PLACEHOLDER}
            alt={article.title}
            className="detail-img"
            onError={() => setImgError(true)}
          />
          <div className="detail-description">
            <p>{article.description}</p>
          </div>
          {article.content && (
            <div
              className="detail-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="read-full-btn"
            >
              Read Full Article →
            </a>
          )}
        </article>
      </div>
    </main>
  );
}
