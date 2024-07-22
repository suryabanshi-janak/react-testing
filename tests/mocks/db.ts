/* eslint-disable @typescript-eslint/unbound-method */
import { factory, oneOf, primaryKey, manyOf } from '@mswjs/data';
import { faker } from '@faker-js/faker';

export const db = factory({
  category: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
    products: manyOf('product'),
  },
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 0, max: 100 }),
    categoryId: faker.number.int,
    category: oneOf('category'),
  },
});
