import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageBouquets.css';

// Добавляем 'user' в пропсы на всякий случай
const ManageBouquets = ({ customerId, user }) => {
    const [bouquets, setBouquets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // УМНАЯ ПРОВЕРКА ID:
    // Если пришел готовый customerId - берем его.
    // Если пришел объект user - достаем ID из него.
    const finalCustomerId = customerId || user?.customerId || user?.customer?.id || user?.id;

    const fetchBouquets = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/bouquets');
            setBouquets(response.data);
            console.log("Загруженные букеты:", response.data);
        } catch (e) {
            console.error("Ошибка загрузки:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBouquets();
        // Лог для проверки в консоли (F12)
        console.log("ManageBouquets получил ID:", finalCustomerId);
    }, [finalCustomerId]);

    const handleAddToCart = async (bouquetId) => {
        // Используем вычисленный ID
        if (!finalCustomerId) {
            alert(`Ошибка: ID не найден. Проверьте пропсы в AdminPanel!`);
            console.error("Данные в компоненте:", { customerId, user });
            return;
        }
        try {
            await axios.post(`http://localhost:8080/carts/${finalCustomerId}/add/${bouquetId}`);
            alert("Букет добавлен в корзину! 🌸");
        } catch (error) {
            console.error("Ошибка API:", error);
            alert("Ошибка при добавлении в корзину");
        }
    };

    const filteredBouquets = bouquets.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-bouquets-container fade-in">
            <div className="manager-header">
                <h2 className="manager-title">Управление букетами</h2>
                <div className="search-box-luxury">
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-text">Загрузка данных...</div>
            ) : (
                <div className="bouquets-list-table">
                    <div className="table-header-luxury">
                        <div className="col-photo">Фото</div>
                        <div className="col-name">Название</div>
                        <div className="col-details">Состав</div>
                        <div className="col-price">Цена</div>
                        <div className="col-actions">Действие</div>
                    </div>

                    {filteredBouquets.map(b => (
                        <div key={b.id} className="bouquet-row-luxury">
                            <div className="col-photo">
                                <img src={b.pathPhoto || 'https://via.placeholder.com/60'} alt={b.name} className="row-img" />
                            </div>
                            <div className="col-name">
                                <strong>{b.name}</strong>
                                <span className="row-id">ID: {b.id}</span>
                            </div>
                            <div className="col-details">
                                {b.flowers?.length || 0} шт.
                            </div>
                            <div className="col-price">
                                {b.price} BYN
                            </div>
                            <div className="col-actions">
                                <button
                                    className="action-btn-add"
                                    onClick={() => handleAddToCart(b.id)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageBouquets;