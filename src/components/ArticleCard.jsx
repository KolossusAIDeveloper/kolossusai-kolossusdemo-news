import React, { useState } from 'react';
import './ArticleCard.css';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect width='400' height='220' fill='%232a2d45'/%3E%3Ctext x='200' y='120' text-anchor='middle' fill='%23606880' font-size='48'%3E📰%3C/text%3E%3C/svg%3E";

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ArticleCard({ article, onSelect }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="article-card"
      onClick={() => onSelect(article)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(article)}
      aria-label={article.title}
    >
      <div className="card-img-wrap">
        <img
          src={!imgError && article.image ? article.image : PLACEHOLDER}
          alt={article.title}
          className="card-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <span className="card-category">{article.category}</span>
      </div>
      <div className="card-body">
        <h2 className="card-title">{article.title}</h2>
        <p className="card-desc">{article.description}</p>
        <div className="card-footer">
          <span className="card-date">{formatDate(article.pubDate)}</span>
          <div className="card-sources">
            {article.sources.map((s, i) => (
              <span key={i} className="source-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
