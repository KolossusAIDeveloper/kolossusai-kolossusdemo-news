import React from 'react';
import './ArticleGrid.css';
import ArticleCard from './ArticleCard';

export default function ArticleGrid({ articles, loading, onSelect }) {
  if (loading) {
    return (
      <div className="grid-loading">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-img" />
            <div className="skeleton-body">
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="grid-empty">
        <span className="empty-icon">📭</span>
        <p>No articles found. Try a different search or category.</p>
      </div>
    );
  }

  return (
    <div className="article-grid">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} onSelect={onSelect} />
      ))}
    </div>
  );
}
