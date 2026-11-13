import React from 'react';
import './CategoryTabs.css';

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <nav className="category-tabs" aria-label="News categories">
      {categories.map(cat => (
        <button
          key={cat}
          className={`tab-btn${active === cat ? ' active' : ''}`}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
