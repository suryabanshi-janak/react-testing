import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProductForm from '../../src/components/ProductForm';
import { AllProviders } from '../AllProviders';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';

describe('ProductForm', () => {
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();
    render(<ProductForm product={product} onSubmit={onSubmit} />, {
      wrapper: AllProviders,
    });

    return {
      onSubmit,
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole('alert');
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },
      waitForFormToLoad: async () => {
        await screen.findByRole('form');

        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole('combobox', {
          name: 'Category',
        });
        const submitButton = screen.getByRole('button');

        type FormData = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [K in keyof Product]: any;
        };

        const validData = {
          id: 1,
          name: 'a',
          price: 1,
          categoryId: category.id,
        };

        const fill = async (product: FormData) => {
          const user = userEvent.setup();

          if (product.name !== undefined)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await user.type(nameInput, product.name);

          if (product.price !== undefined)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            await user.type(priceInput, product.price.toString());

          await user.tab();
          await user.click(categoryInput);
          const options = screen.getAllByRole('option');
          await user.click(options[0]);

          await user.click(submitButton);
        };

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          fill,
          validData,
        };
      },
    };
  };

  it('should render form fields', async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it('should populate form fields when editing a product', async () => {
    const product: Product = {
      id: 1,
      name: 'Category',
      price: 20,
      categoryId: category.id,
    };

    const { waitForFormToLoad } = renderComponent(product);

    const { nameInput, priceInput, categoryInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  it('should put focus on the name field', async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();
    expect(nameInput).toHaveFocus();
  });

  it.each([
    {
      scenario: 'missing',
      errorMessage: /required/i,
    },
    {
      scenario: 'longer than 255 character',
      name: 'a'.repeat(256),
      errorMessage: /255/,
    },
  ])(
    'should display an error if name is $scenario',
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();
      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    {
      scenario: 'missing',
      errorMessage: /required/i,
    },
    {
      scenario: '0',
      price: 0,
      errorMessage: /1/,
    },
    {
      scenario: 'negative',
      price: -1,
      errorMessage: /1/,
    },
    {
      scenario: 'greater than 1000',
      price: 1001,
      errorMessage: /1000/,
    },
    {
      scenario: 'not a number',
      price: 'a',
      errorMessage: /required/i,
    },
  ])(
    'should display an error if name is $scenario',
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();
      const form = await waitForFormToLoad();
      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it('should call onSubmit with the correct data', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...formData } = form.validData;
    expect(onSubmit).toHaveBeenCalledWith(formData);
  });

  it('should display a toast if submission fails', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    const toast = await screen.findByRole('status');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it('should disable the submit button upon submission', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => {}));

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).toBeDisabled();
  });

  it('should re-enable the submit button after submission', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({});

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).not.toBeDisabled();
  });

  it('should re-enable the submit button after submission', async () => {
    const { waitForFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue('error');

    const form = await waitForFormToLoad();
    await form.fill(form.validData);

    expect(form.submitButton).not.toBeDisabled();
  });
});
