import React, { useState, useEffect } from 'react';
import api from '../../api';
import './ManageCustomers.css';

const ManageCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    const [flowerName, setFlowerName] = useState('');
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterId, setFilterId] = useState('');
    const [filterName, setFilterName] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            setFilterId('');
            setFilterName('');
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch (e) {
            console.error("Ошибка загрузки:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleIdSearch = async () => {
        if (!filterId) {
            fetchData();
            return;
        }
        try {
            setLoading(true);
            const response = await api.get(`/customers/${filterId}`);
            const data = response.data;

            if (data && (data.id === 1 || data.name.toLowerCase().includes('admin'))) {
                alert("Доступ к профилю администратора ограничен");
                setCustomers([]);
            } else {
                setCustomers(data ? [data] : []);
            }
        } catch (e) {
            console.error("Покупатель не найден:", e);
            setCustomers([]);
            alert("Покупатель с таким ID не найден");
        } finally {
            setLoading(false);
        }
    };

    const handleAdvancedSearch = async () => {
        if (!flowerName.trim()) {
            alert("Введите название цветка");
            return;
        }
        try {
            setLoading(true);
            const response = await api.get('/customers/find-by-flowers', {
                params: { flowerName, date: searchDate, page: 0, size: 50 }
            });
            setCustomers(response.data.content || []);
        } catch (e) {
            console.error("Ошибка поиска:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = async (customer) => {
        setSelectedCustomer(customer);
        setModalLoading(true);
        try {
            const response = await api.get('/orders');
            const clientOrders = response.data.filter(order => order.customerId === customer.id);
            setCustomerOrders(clientOrders);
        } catch (e) {
            console.error("Ошибка загрузки заказов:", e);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredCustomers = customers.filter(c => {
        const matchesName = c.name.toLowerCase().includes(filterName.toLowerCase());
        const isNotAdmin = c.id !== 1 && !c.name.toLowerCase().includes('admin');
        return matchesName && isNotAdmin;
    });

    return (
        <div className="flowers-admin-panel fade-in">
            <div className="operation-content">
                <div className="admin-inner-padding">
                    <div className="luxury-filter-panel highlight-bg">
                        <div className="filter-group">
                            <span className="filter-hint">Цветок в букете</span>
                            <input
                                type="text"
                                className="filter-input-medium"
                                value={flowerName}
                                onChange={(e) => setFlowerName(e.target.value)}
                                placeholder="Напр: Роза"
                            />
                        </div>
                        <div className="filter-group">
                            <span className="filter-hint">Дата покупки</span>
                            <input
                                type="date"
                                className="filter-input-medium"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                            />
                        </div>
                        <button className="action-btn-mini gold-btn" onClick={handleAdvancedSearch}>
                            Найти по составу
                        </button>
                    </div>

                    <div className="luxury-filter-panel">
                        <div className="filter-group">
                            <span className="filter-hint">ID (Сервер)</span>
                            <div className="input-with-button">
                                <input
                                    type="number"
                                    className="filter-input-short"
                                    value={filterId}
                                    onChange={(e) => setFilterId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleIdSearch()}
                                    placeholder="0"
                                />
                                <button className="action-btn-mini" onClick={handleIdSearch}>OK</button>
                            </div>
                        </div>
                        <div className="filter-group">
                            <span className="filter-hint">Имя (в списке)</span>
                            <input
                                type="text"
                                className="filter-input-medium wide"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                placeholder="Поиск по ФИО..."
                            />
                        </div>
                        <button className="action-btn-mini reset-btn" onClick={fetchData}>
                            Сбросить
                        </button>
                    </div>

                    <div className="table-container-luxury">
                        {loading ? (
                            <div className="loading-text">Загрузка данных...</div>
                        ) : (
                            <table className="luxury-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Покупатель</th>
                                    <th>Телефон</th>
                                    <th>Заказов</th>
                                    <th className="text-right">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredCustomers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="id-cell">#{customer.id}</td>
                                        <td className="name-cell">{customer.name}</td>
                                        <td className="phone-cell">{customer.phoneNumber}</td>
                                        <td>
                                            <span className="order-count-badge">
                                                {customer.orderIds?.length || 0} ШТ.
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                className="action-btn-mini"
                                                onClick={() => handleOpenDetails(customer)}
                                            >
                                                Детали
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {selectedCustomer && (
                <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
                    <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Профиль: {selectedCustomer.name}</h2>
                            <button className="close-btn" onClick={() => setSelectedCustomer(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-info"><strong>Телефон:</strong> {selectedCustomer.phoneNumber}</p>
                            <h3 className="section-title">История заказов</h3>

                            <div className="modal-order-bouquets-grid">
                                {modalLoading ? (
                                    <p>Загрузка истории...</p>
                                ) : customerOrders.length > 0 ? (
                                    customerOrders.map(order => (
                                        (order.bouquets || []).map((bq, idx) => (
                                            <div key={`${order.id}-${idx}`} className="bouquet-order-card-luxury">
                                                <div className="bq-text-info">
                                                    <div className="order-id-label">Заказ #{order.id}</div>
                                                    <div className="bq-name-mini">{bq.name}</div>
                                                    <div className="bq-price-mini">{order.finalPrice} BYN</div>
                                                </div>
                                                <div className={`mini-status-label ${order.status}`}>
                                                    {order.status}
                                                </div>
                                            </div>
                                        ))
                                    ))
                                ) : (
                                    <p className="no-data">Заказов не найдено</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCustomers;