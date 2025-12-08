# React Query Migration Guide

## Overview
This guide helps you migrate from Redux/manual API calls to React Query hooks.

## Migration Steps

### 1. Replace Redux Selectors with React Query Hooks

**Before (Redux):**
```js
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../redux/slice/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render products */}</div>;
};
```

**After (React Query):**
```js
import { useProducts } from '../hooks/useProducts';

const Products = () => {
  const { data: products, isLoading, error } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render products */}</div>;
};
```

### 2. Replace Auth Logic

**Before:**
```js
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../redux/slice/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  
  const handleSubmit = async (formData) => {
    dispatch(loginUser(formData));
  };
};
```

**After:**
```js
import { useLogin } from '../hooks/useAuth';

const Login = () => {
  const loginMutation = useLogin();
  
  const handleSubmit = async (formData) => {
    loginMutation.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {loginMutation.isPending && <div>Logging in...</div>}
      {/* Form fields */}
    </form>
  );
};
```

### 3. Replace Cart Logic

**Before:**
```js
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slice/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector(state => state.cart);
  
  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };
};
```

**After:**
```js
import { useAddToCart, useCartUtils } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const addToCartMutation = useAddToCart();
  const { isInCart, getItemQuantity } = useCartUtils();
  
  const handleAddToCart = () => {
    addToCartMutation.mutate({ productId: product._id, quantity: 1 });
  };
  
  const inCart = isInCart(product._id);
  const quantity = getItemQuantity(product._id);
};
```

## Key Benefits

1. **Automatic Caching**: Data is cached and reused across components
2. **Background Updates**: Data is automatically synchronized
3. **Optimistic Updates**: UI updates immediately, rolls back on error
4. **Error Handling**: Centralized error handling with retry logic
5. **Loading States**: Built-in loading and error states
6. **DevTools**: React Query DevTools for debugging

## Common Patterns

### Loading States
```js
const { data, isLoading, isFetching, isError, error } = useProducts();

// isLoading: Initial load
// isFetching: Any network request (including background refetch)
// isError: Query failed
// error: Error object with details
```

### Mutations with Optimistic Updates
```js
const updateMutation = useUpdateProduct();

const handleUpdate = (updates) => {
  updateMutation.mutate(
    { productId, productData: updates },
    {
      onSuccess: () => {
        // Handle success
        navigate('/products');
      },
      onError: (error) => {
        // Handle error
        console.error('Update failed:', error);
      },
    }
  );
};
```

### Conditional Queries
```js
// Only run query when user is authenticated
const { data: userOrders } = useUserOrders(!!user);

// Only run when product ID is available
const { data: product } = useProduct(productId, !!productId);
```

### Dependent Queries
```js
const { data: user } = useUserProfile();
const { data: orders } = useUserOrders(!!user?.id);
```

## Migration Checklist

- [ ] Replace all Redux selectors with React Query hooks
- [ ] Remove Redux async thunks (createAsyncThunk)
- [ ] Update loading states (loading → isLoading, isPending)
- [ ] Update error handling (error → error.message)
- [ ] Remove manual API calls in useEffect
- [ ] Add error boundaries for better error handling
- [ ] Test all CRUD operations
- [ ] Verify optimistic updates work correctly
- [ ] Check that cache invalidation works properly