# How to use the `useAddToCart` hook

The `useAddToCart` hook is a custom hook designed to add items to a user's shopping cart. It is built on top of `react-query`'s `useMutation` hook and handles API requests, optimistic updates, and error handling.

## Basic Usage

To use the `useAddToCart` hook, import it into your component and call it to get a mutation function.

```jsx
import { useAddToCart } from '../hooks/useCart';

const AddToCartButton = ({ productId, quantity }) => {
  const { mutate: addToCart, isLoading } = useAddToCart();

  const handleAddToCart = () => {
    addToCart({ productId, quantity });
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};
```

## How it Works

The `useAddToCart` hook performs the following actions:

1.  **`useMutation`**: It uses `useMutation` to wrap the `cartApi.addToCart` function.
2.  **`onMutate`**: Before the mutation runs, it optimistically updates the local cache.
    *   It cancels any ongoing queries for the user's cart.
    *   It snapshots the current cart data.
    *   It updates the cart data in the cache with the new item.
3.  **`onError`**: If the mutation fails, it rolls back the optimistic update and displays an error toast message.
4.  **`onSuccess`**: If the mutation is successful, it invalidates the cart queries to refetch the latest data from the server and displays a success toast message.

## Parameters

The `addToCart` function (the `mutate` function returned by the hook) accepts an object with the following properties:

*   `productId` (required): The ID of the product to add to the cart.
*   `quantity` (optional): The number of items to add. Defaults to `1`.

## Return Value

The `useAddToCart` hook returns an object with the following properties from `useMutation`:

*   `mutate`: The mutation function to trigger adding an item to the cart.
*   `isLoading`: A boolean indicating if the mutation is in progress.
*   `isError`: A boolean indicating if an error occurred.
*   `isSuccess`: A boolean indicating if the mutation was successful.
*   `error`: The error object if an error occurred.
*   `data`: The data returned from the API on success.

## Example with a Product Card

Here's an example of how you might use the `useAddToCart` hook in a `ProductCard` component:

```jsx
import React from 'react';
import { useAddToCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { mutate: addToCart, isLoading } = useAddToCart();

  const handleAddToCart = () => {
    addToCart({ productId: product._id, quantity: 1 });
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart} disabled={isLoading}>
        {isLoading ? 'Adding to cart...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
```
