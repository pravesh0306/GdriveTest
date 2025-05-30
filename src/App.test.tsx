import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders Google Drive uploader UI', () => {
    render(<App />);
    // Check for file input and upload button
    expect(screen.getByLabelText(/file/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });
});
