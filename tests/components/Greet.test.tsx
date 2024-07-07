import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

describe('group', () => {
  it('should render Hello with name when name is provided', () => {
    render(<Greet name='Zanak' />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/zanak/i);
  });

  it('should render Login button when name is not provided', () => {
    render(<Greet />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
