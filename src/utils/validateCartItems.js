const validateCartItems = (items) => {
	if (!items || items.length === 0) {
		return "Cart is empty";
	}

	for (const item of items) {
		if (!item.productId || !item.quantity || item.quantity < 1) {
			return `Invalid item data for product: ${item.name || item.productId}`;
		}
	}

	return null;
};

export default validateCartItems;
