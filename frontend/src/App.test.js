import { render, screen } from '@testing-library/react';
import App from './App';

test('shows login when a guest opens the application', () => {
  render(<App />);
  const linkElement = screen.getByRole('button', { name: 'Đăng nhập' });
  expect(linkElement).toBeInTheDocument();
});
