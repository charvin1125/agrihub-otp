
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./styles/Product.css"; // Import the CSS file
import NavigationBar from "../components/Navbar";

const ShopPage = () => {
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]); // State for storing fetched products

    // Fetch products from the backend
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/product/list");
            console.log("Fetched products:", response.data); // Debugging log
            setProducts(response.data); // Store fetched products in state
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("Failed to fetch products.");
        }
    };

    // Add product to cart
    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    // Calculate total price in the cart
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    // Open modal with product details
    const openProductDetails = (product) => {
        setSelectedProduct(product);
    };

    // Close modal
    const closeProductDetails = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="shop-page">
            <NavigationBar />
            <h1>Agriculture Products Shop</h1>

            {/* Products Section */}
            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="product-card">
                            <img
                                src={`http://localhost:5000/uploads/${product.image}`} // Fetch image dynamically
                                alt={product.name}
                                onClick={() => openProductDetails(product)}
                                style={{ cursor: 'pointer' }}
                            />
                            <h3>{product.name}</h3>
                            <p className="price">Rs.{product.price}</p>
                            <button onClick={() => addToCart(product)}>Add to Cart</button>
                        </div>
                    ))
                ) : (
                    <p>Loading products...</p>
                )}
            </div>

            {/* Cart Section */}
            <div className="cart-section">
                <h2>Shopping Cart</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <ul>
                            {cart.map((item, index) => (
                                <li key={index}>
                                    {item.name} - Rs.{item.price}
                                </li>
                            ))}
                        </ul>
                        <h3>Total: Rs.{totalPrice}</h3>
                    </>
                )}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <div className="product-modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeProductDetails}>
                            &times;
                        </span>
                        <img src={`http://localhost:5000/uploads/${selectedProduct.image}`} alt={selectedProduct.name} />
                        <h2>{selectedProduct.name}</h2>
                        <p>{selectedProduct.description}</p>
                        <p className="price">Rs.{selectedProduct.price}</p>
                        <button onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
                        <button className="order-now" onClick={() => alert('Order placed!')}>
                            Order Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopPage;
