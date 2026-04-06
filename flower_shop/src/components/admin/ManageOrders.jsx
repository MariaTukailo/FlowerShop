import React, { useState, useEffect } from 'react';
import api from '../../api';
import './ManageOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const statusLabels = {
        "PROCESSING": "Обработка",
        "SHIPPING": "Принят",
        "DELIVERED": "Доставлен",
        "CANCELLED": "Отменен"
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');

            const normalizedData = response.data.map(order => ({
                ...order,
                status: Object.keys(statusLabels).find(key => statusLabels[key] === order.status) || order.status
            }));
            setOrders(normalizedData);
        } catch (e) {
            console.error("Ошибка загрузки:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, null, {
                params: { status: newStatus }
            });

            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: newStatus } : o
            ));
        } catch (e) {
            console.error(e);
            alert("Ошибка при сохранении статуса");
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesStatus = !filterStatus || o.status === filterStatus;
        const matchesDate = !searchDate || o.deliveryDate === searchDate;
        return matchesStatus && matchesDate;
    });

    return (
        <div className="flowers-admin-panel fade-in">
            <div className="operation-content" style={{ padding: '20px 40px' }}>
                <h1 className="main-title">ORDER MANAGEMENT</h1>

                <div className="luxury-filter-panel">
                    <div className="filter-group">
                        <label className="filter-hint">DATE</label>
                        <input type="date" className="filter-input-medium" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
                    </div>

                    <div className="filter-group">
                        <label className="filter-hint">STATUS</label>
                        <select
                            className="filter-input-medium"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {Object.entries(statusLabels).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <button className="reset-btn-circle" onClick={() => {setSearchDate(''); setFilterStatus('');}}>✕</button>
                </div>

                <div className="table-container-luxury">
                    <table className="luxury-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>CUSTOMER</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="id-cell">#{order.id}</td>
                                    <td>{order.deliveryDate}</td>
                                    <td>ID: {order.customerId}</td>
                                    <td className="price-cell"><strong>{order.finalPrice} BYN</strong></td>
                                    <td>
                                        <select
                                            className={`status-select ${order.status}`}
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {Object.entries(statusLabels).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>Заказов не найдено</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;