// import { createContext, useState, useEffect } from "react";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {

//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem("cart");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   // useEffect(() => {
//   //   localStorage.setItem("cart", JSON.stringify(cart));
//   // }, [cart]);
//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(storedCart);
//   }, []);
  

//   const addToCart = (product) => {
//     setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem("cart"); // ✅ Clear local storage
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedVariant) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item._id === product._id && item.size === selectedVariant.size
      );

      if (existingItemIndex !== -1) {
        // If item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Add new item with variant and GST
        return [
          ...prevCart,
          {
            _id: product._id,
            name: product.name,
            image: product.image,
            size: selectedVariant.size,
            price: selectedVariant.price,
            gst: selectedVariant.gst, // Include GST from selected variant
            quantity: 1,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, size, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity: quantity > 0 ? quantity : 1 }
          : item
      )
    );
  };

  const removeFromCart = (productId, size) => {
    setCart((prevCart) => prevCart.filter((item) => !(item._id === productId && item.size === size)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
