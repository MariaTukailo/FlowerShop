import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageOrders.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filterOrderId, setFilterOrderId] = useState('');
    const [filterCustomerId, setFilterCustomerId] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);

    // Карта для перевода: экранное имя -> системное для БД
    const statusMapping = {
        "PROCESSING": "Обработка",
        "SHIPPING": "Принят",
        "DELIVERED": "Доставлен",
        "CANCELLED": "Отменен"
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/orders');
            setOrders(response.data);
        } catch (e) {
            console.error("Загрузка не удалась:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (orderId, newSystemStatus) => {
        // Просто отправляем запрос без лишних алертов
        axios.patch(`http://localhost:8080/orders/${orderId}/status`, null, {
            params: { status: newSystemStatus }
        });

        // Сразу обновляем интерфейс, чтобы всё было "летучим"
        const russianName = statusMapping[newSystemStatus];
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: russianName } : o));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Помощник для CSS классов (используем системные имена для цветов)
    const getStatusClass = (russianStatus) => {
        return Object.keys(statusMapping).find(key => statusMapping[key] === russianStatus) || "";
    };

    const filteredOrders = orders.filter(o => {
        const matchesOrder = filterOrderId ? o.id.toString().includes(filterOrderId) : true;
        const matchesCustomer = filterCustomerId ? o.customerId?.toString().includes(filterCustomerId) : true;
        const matchesStatus = filterStatus ? o.status === filterStatus : true;
        return matchesOrder && matchesCustomer && matchesStatus;
    });

    return (
        <div className="flowers-admin-panel fade-in">
            <div className="operation-content">
                <div style={{ padding: '0 40px' }}>

                    {/* Фильтры */}
                    <div className="luxury-filter-panel">
                        <div className="filter-group">
                            <span className="filter-hint">Дата доставки</span>
                            <input type="date" className="filter-input-medium" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                        </div>
                        <button className="action-btn-mini" style={{ background: '#bfa37e' }} onClick={fetchData}>
                            Обновить список
                        </button>
                    </div>

                    <div className="luxury-filter-panel" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <div className="filter-group">
                            <span className="filter-hint">Заказ #</span>
                            <input type="number" className="filter-input-short" value={filterOrderId} onChange={e => setFilterOrderId(e.target.value)} />
                        </div>
                        <div className="filter-group">
                            <span className="filter-hint">Клиент #</span>
                            <input type="number" className="filter-input-short" value={filterCustomerId} onChange={e => setFilterCustomerId(e.target.value)} />
                        </div>
                        <div className="filter-group" style={{ flexGrow: 1 }}>
                            <span className="filter-hint">Статус</span>
                            <select className="filter-input-medium" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                <option value="">Все статусы</option>
                                {Object.values(statusMapping).map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Таблица */}
                    <div className="table-container-luxury">
                        <table className="luxury-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Время</th>
                                <th>Клиент</th>
                                <th>Адрес</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="id-cell">#{order.id}</td>
                                    <td>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{order.deliveryTime}</div>
                                        <div style={{ fontSize: '11px', color: '#999' }}>{order.deliveryDate}</div>
                                    </td>
                                    <td className="name-cell">ID Покупателя: {order.customerId}</td>
                                    <td style={{ maxWidth: '200px', fontSize: '12px' }}>{order.address}</td>
                                    <td style={{ fontWeight: 'bold', color: '#bfa37e' }}>{order.finalPrice} BYN</td>
                                    <td>
                                        <select
                                            className={`status-select ${getStatusClass(order.status)}`}
                                            value={Object.keys(statusMapping).find(key => statusMapping[key] === order.status)}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {Object.entries(statusMapping).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;