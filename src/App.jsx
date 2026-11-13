import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import SearchBar from './components/SearchBar.jsx';
import ArticleGrid from './components/ArticleGrid.jsx';
import ArticleDetail from './components/ArticleDetail.jsx';
import { fetchAllFeeds } from './hooks/useFeed';
import { deduplicateArticles } from './hooks/dedup';

const CATEGORIES = ['All', 'Technology', 'World', 'Science'];

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('news-theme');
    if (saved) return saved;
  } catch (e) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('news-theme', theme); } catch (e) {}
  }, [theme]);

  const loadFeeds = useCallback(async () => {
    try {
      const raw = await fetchAllFeeds();
      const deduped = deduplicateArticles(raw);
      setArticles(deduped);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError('Failed to load news feeds. Retrying...');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeeds();
    const interval = setInterval(loadFeeds, 60000);
    return () => clearInterval(interval);
  }, [loadFeeds]);

  const filtered = articles.filter(a => {
    const matchCat = category === 'All' || a.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      a.title.toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (selectedArticle) {
    return (
      <div className="app">
        <Header theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
        <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
      </div>
    );
  }

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <main className="main-content">
        <CategoryTabs categories={CATEGORIES} active={category} onChange={setCategory} />
        <SearchBar value={search} onChange={setSearch} />
        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 60s
          </p>
        )}
        {error && <div className="error-banner">{error}</div>}
        <ArticleGrid
          articles={filtered}
          loading={loading}
          onSelect={setSelectedArticle}
        />
      </main>
    </div>
  );
}
