import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageShoppingCards.css';

const Cart = ({ customerId }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    // Состояния для формы заказа
    const [isCheckout, setIsCheckout] = useState(false);
    const [address, setAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    const fetchCart = async () => {
        if (!customerId) return;
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/carts/${customerId}`);
            setCart(response.data);
        } catch (e) {
            console.error("Ошибка при загрузке корзины:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [customerId]);

    // Функция оформления заказа (вызываем твой OrderController)
    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        try {
            // В контроллере используются @RequestParam, поэтому передаем в params
            await axios.post(`http://localhost:8080/orders/checkout/${customerId}`, null, {
                params: {
                    deliveryDate: deliveryDate,
                    deliveryTime: deliveryTime,
                    address: address
                }
            });
            alert("Заказ успешно оформлен!");
            setIsCheckout(false);
            fetchCart(); // Корзина должна очиститься на бэкенде после заказа
        } catch (e) {
            alert("Ошибка при оформлении: " + (e.response?.data?.message || e.message));
        }
    };

    const handleRemove = async (bouquetId) => {
        try {
            await axios.delete(`http://localhost:8080/carts/${customerId}/remove/${bouquetId}`);
            fetchCart();
        } catch (e) {
            alert("Не удалось удалить букет");
        }
    };

    const handleClear = async () => {
        try {
            await axios.delete(`http://localhost:8080/carts/${customerId}/clear`);
            setCart({ ...cart, bouquets: [] });
        } catch (e) {
            alert("Не удалось очистить корзину");
        }
    };

    if (loading) return <div className="cart-loading">Загрузка вашей корзины...</div>;

    // ЕСЛИ ПОЛЬЗОВАТЕЛЬ НАЖАЛ "ОФОРМИТЬ", ПОКАЗЫВАЕМ ФОРМУ
    if (isCheckout) {
        return (
            <div className="cart-container fade-in">
                <h2 className="cart-title">Детали доставки</h2>
                <form className="checkout-form" onSubmit={handleOrderSubmit}>
                    <div className="form-group">
                        <label>Адрес доставки:</label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Улица, дом, квартира"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Дата:</label>
                            <input
                                type="date"
                                required
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Время:</label>
                            <input
                                type="time"
                                required
                                value={deliveryTime}
                                onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="cart-actions">
                        <button type="button" className="clear-cart-btn" onClick={() => setIsCheckout(false)}>Назад</button>
                        <button type="submit" className="checkout-btn-luxury">Подтвердить заказ</button>
                    </div>
                </form>
            </div>
        );
    }

    // ОБЫЧНЫЙ ВИД КОРЗИНЫ
    return (
        <div className="cart-container fade-in">
            <h2 className="cart-title">Ваша корзина</h2>

            {!cart || cart.bouquets.length === 0 ? (
                <div className="cart-empty">
                    <p>В корзине пока пусто</p>
                    <span className="cart-subtitle">Самое время добавить в неё что-нибудь прекрасное!</span>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cart.bouquets.map((bouquet, index) => (
                            <div key={`${bouquet.id}-${index}`} className="cart-item">
                                <div className="item-info">
                                    <span className="item-name">{bouquet.name}</span>
                                    <span className="item-price">{bouquet.price} BYN</span>
                                </div>
                                <button className="remove-item-btn" onClick={() => handleRemove(bouquet.id)}>Удалить</button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="total-price">
                            Итого: {cart.bouquets.reduce((sum, b) => sum + b.price, 0)} BYN
                        </div>
                        <div className="cart-actions">
                            <button className="clear-cart-btn" onClick={handleClear}>Очистить всё</button>
                            {/* ТЕПЕРЬ КНОПКА ПЕРЕКЛЮЧАЕТ НА ФОРМУ */}
                            <button className="checkout-btn-luxury" onClick={() => setIsCheckout(true)}>Оформить заказ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;