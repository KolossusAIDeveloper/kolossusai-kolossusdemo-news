import { render, screen } from '@testing-library/react';
import App from './App';

test('renders News Feed header', () => {
  render(<App />);
  expect(screen.getByText(/News Feed/i)).toBeInTheDocument();
});
