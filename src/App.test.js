import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Dmitry Shvetsov link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Dmitry Shvetsov/i);
  expect(linkElement).toBeInTheDocument();
});
