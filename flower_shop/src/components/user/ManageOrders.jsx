import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageOrders.css';

const ManageOrders = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Поля фильтрации
    const [filterDate, setFilterDate] = useState('');
    const [filterTime, setFilterTime] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!customerId) return;
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/orders');
                // Фильтруем заказы, чтобы пользователь видел только свои
                const myOrders = response.data.filter(o => o.customerId === customerId);
                setOrders(myOrders);
            } catch (e) {
                console.error("Ошибка загрузки истории заказов:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [customerId]);

    // Логика фильтрации
    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus ? order.status === filterStatus : true;
        const matchesDate = filterDate ? order.deliveryDate === filterDate : true;
        const matchesTime = filterTime ? order.deliveryTime.startsWith(filterTime) : true;
        return matchesStatus && matchesDate && matchesTime;
    });

    if (loading) return <div className="loading-luxury">Загрузка истории...</div>;

    return (
        <div className="manage-orders-container fade-in">
            <h2 className="form-title-luxury">История ваших заказов</h2>

            <div className="luxury-filter-panel">
                <div className="filter-group">
                    <span className="filter-hint">Дата доставки</span>
                    <input
                        type="date"
                        className="filter-input-medium"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <span className="filter-hint">Время доставки</span>
                    <input
                        type="time"
                        className="filter-input-short"
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <span className="filter-hint">Статус</span>
                    <select
                        className="filter-input-medium"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Все статусы</option>
                        <option value="Обработка">Обработка</option>
                        <option value="Принят">Принят</option>
                        <option value="Доставлен">Доставлен</option>
                        <option value="Отменен">Отменен</option>
                    </select>
                </div>

                {(filterDate || filterTime || filterStatus) && (
                    <button className="reset-filter-btn" onClick={() => {
                        setFilterDate('');
                        setFilterTime('');
                        setFilterStatus('');
                    }}>✕</button>
                )}
            </div>

            {filteredOrders.length === 0 ? (
                <div className="no-orders-message">
                    <p>Заказов не найдено.</p>
                    <span className="empty-subtitle">Попробуйте изменить параметры фильтрации.</span>
                </div>
            ) : (
                <div className="table-container-luxury">
                    <table className="luxury-table">
                        <thead>
                        <tr>
                            <th>№ Заказа</th>
                            <th>Дата доставки</th>
                            <th>Время</th>
                            <th>Адрес и состав</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td className="id-cell">#{order.id}</td>
                                <td className="name-cell">{order.deliveryDate}</td>
                                <td>{order.deliveryTime}</td>

                                {/* Ячейка с Адресом и Букетами */}
                                <td className="address-composition-cell">
                                    <div className="order-address">
                                        <strong>📍 Адрес:</strong> {order.address || "Не указан"}
                                    </div>
                                    <div className="order-items-detail">
                                        <strong>💐 Букеты:</strong> {
                                        order.bouquets && order.bouquets.length > 0
                                            ? order.bouquets.map(b => b.name).join(', ')
                                            : "Нет данных о составе"
                                    }
                                    </div>
                                </td>

                                <td className="price-cell-bold">{order.finalPrice} BYN</td>
                                <td>
                                    <span className={`status-badge ${
                                        order.status === 'Обработка' ? 'PROCESSING' :
                                            order.status === 'Принят' ? 'SHIPPING' :
                                                order.status === 'Доставлен' ? 'DELIVERED' : 'CANCELLED'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;