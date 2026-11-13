function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

function similarity(a, b) {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  const wordsA = new Set(na.split(' ').filter(w => w.length > 3));
  const wordsB = new Set(nb.split(' ').filter(w => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let common = 0;
  wordsA.forEach(w => { if (wordsB.has(w)) common++; });
  return common / Math.max(wordsA.size, wordsB.size);
}

export function deduplicateArticles(articles) {
  const groups = [];

  articles.forEach(article => {
    const match = groups.find(g => similarity(g[0].title, article.title) >= 0.6);
    if (match) {
      match.push(article);
    } else {
      groups.push([article]);
    }
  });

  return groups.map(group => {
    const primary = group[0];
    const sources = [...new Set(group.map(a => a.source))];
    return {
      ...primary,
      sources,
      id: primary.id,
    };
  });
}
