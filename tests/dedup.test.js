const { deduplicateArticles } = require('../src/hooks/dedup');

test('identical titles merge into one card', () => {
  const articles = [
    { id: 'a1', title: 'SpaceX launches new rocket', source: 'NASA', category: 'Science', sources: ['NASA'] },
    { id: 'a2', title: 'SpaceX launches new rocket', source: 'Science Daily', category: 'Science', sources: ['Science Daily'] },
  ];
  const result = deduplicateArticles(articles);
  expect(result).toHaveLength(1);
  expect(result[0].sources).toContain('NASA');
  expect(result[0].sources).toContain('Science Daily');
});

test('different titles stay separate', () => {
  const articles = [
    { id: 'b1', title: 'AI breakthrough in medicine', source: 'Wired', category: 'Technology', sources: ['Wired'] },
    { id: 'b2', title: 'Climate change summit opens', source: 'BBC', category: 'World', sources: ['BBC'] },
  ];
  const result = deduplicateArticles(articles);
  expect(result).toHaveLength(2);
});

test('empty array returns empty', () => {
  expect(deduplicateArticles([])).toHaveLength(0);
});
