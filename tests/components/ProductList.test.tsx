import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';

describe('ProducList', () => {
  it('should render list of products', async () => {
    render(<ProductList />);

    const list = await screen.findAllByRole('listitem');
    expect(list.length).toBeGreaterThan(0);
  });

  it('should render no products available if no product is found', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));

    render(<ProductList />);

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });
});
