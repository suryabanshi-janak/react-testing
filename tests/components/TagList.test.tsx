import { render, screen } from '@testing-library/react';
import TagList from '../../src/components/TagList';

describe('TagList', () => {
  it('should render tags', async () => {
    render(<TagList />);

    const tags = await screen.findAllByRole('listitem');
    expect(tags.length).toBeGreaterThan(0);
  });
});
