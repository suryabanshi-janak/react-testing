import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TermsAndConditions from '../../src/components/TermsAndConditions';

describe('TermsAndConditions', () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole('heading'),
      button: screen.getByRole('button'),
      checkbox: screen.getByRole('checkbox'),
    };
  };

  it('should render component properly', () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent('Terms & Conditions');
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it('enable submit when checkbox is checked', async () => {
    const { checkbox, button } = renderComponent();

    const user = userEvent.setup();
    await user.click(checkbox);

    expect(button).toBeEnabled();
  });
});
