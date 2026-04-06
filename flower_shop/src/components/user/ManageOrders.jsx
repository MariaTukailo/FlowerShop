import React, { useState, useEffect } from 'react';
import api from '../../api';
import './ManageOrders.css';

const ManageOrders = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filterDate, setFilterDate] = useState('');
    const [filterTime, setFilterTime] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const statusLabels = {
        "PROCESSING": "Обработка",
        "SHIPPING": "Принят",
        "DELIVERED": "Доставлен",
        "CANCELLED": "Отменен"
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!customerId) return;
            try {
                setLoading(true);
                const response = await api.get('/orders');

                const myOrders = response.data
                    .filter(o => o.customerId?.toString() === customerId.toString())
                    .map(order => ({
                        ...order,
                        status: Object.keys(statusLabels).find(key => statusLabels[key] === order.status) || order.status
                    }));

                setOrders(myOrders);
            } catch (e) {
                console.error("Ошибка загрузки:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [customerId]);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = !filterStatus || order.status === filterStatus;
        const matchesDate = !filterDate || order.deliveryDate === filterDate;
        const matchesTime = !filterTime || (order.deliveryTime && order.deliveryTime.startsWith(filterTime));
        return matchesStatus && matchesDate && matchesTime;
    });

    return (
        <div className="manage-orders-container fade-in">
            <h2 className="form-title-luxury">История ваших заказов</h2>

            <div className="luxury-filter-panel">
                <div className="filter-group">
                    <span className="filter-hint">Дата доставки</span>
                    <input type="date" className="filter-input-medium" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                </div>
                <div className="filter-group">
                    <span className="filter-hint">Время</span>
                    <input type="time" className="filter-input-short" value={filterTime} onChange={(e) => setFilterTime(e.target.value)} />
                </div>
                <div className="filter-group">
                    <span className="filter-hint">Статус</span>
                    <select className="filter-input-medium" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">Все статусы</option>
                        {Object.entries(statusLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
                {(filterDate || filterTime || filterStatus) && (
                    <button className="reset-filter-btn" onClick={() => {setFilterDate(''); setFilterTime(''); setFilterStatus('');}}>✕</button>
                )}
            </div>

            {loading ? (
                <div className="no-orders-message">Загрузка...</div>
            ) : filteredOrders.length === 0 ? (
                <div className="no-orders-message">Заказов не найдено</div>
            ) : (
                <div className="table-container-luxury">
                    <table className="luxury-table">
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Дата и время</th>
                            <th>Адрес и состав</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td className="id-cell">#{order.id}</td>
                                <td>
                                    <div>{order.deliveryDate}</div>
                                    <div style={{fontSize: '11px', color: '#999'}}>{order.deliveryTime}</div>
                                </td>
                                <td className="address-composition-cell">
                                    <strong>📍 {order.address}</strong>
                                    <div className="order-items-detail">
                                        {order.bouquets?.map(b => b.name).join(', ')}
                                    </div>
                                </td>
                                <td className="price-cell-bold">{order.finalPrice} BYN</td>
                                <td>
                                    <span className={`status-badge ${order.status}`}>
                                        {statusLabels[order.status] || order.status}
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