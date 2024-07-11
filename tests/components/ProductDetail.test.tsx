import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import ProductDetail from '../../src/components/ProductDetail';
import { products } from '../mocks/data';
import { server } from '../mocks/server';

describe('ProductDetail', () => {
  it('should render the product', async () => {
    render(<ProductDetail productId={1} />);

    const product = await screen.findByText(new RegExp(products[0].name));
    expect(product).toBeInTheDocument();

    const price = await screen.findByText(
      new RegExp(products[0].price.toString())
    );
    expect(price).toBeInTheDocument();
  });

  it('should render message if product not found', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it('should render error for invalid product id', async () => {
    render(<ProductDetail productId={0} />);

    const error = await screen.findByText(/invalid/i);
    expect(error).toBeInTheDocument();
  });
});
