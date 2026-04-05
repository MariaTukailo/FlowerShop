import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageCustomers.css';
// 1. Импортируем твой новый компонент
import ManageOrders from './ManageOrders';

const Profile = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const userId = user?.id;
    const customerId = user?.customerId || user?.customer?.id;

    const [userData, setUserData] = useState({
        name: '',
        phoneNumber: '',
        orderIds: []
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!customerId) return;
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/customers/${customerId}`);
                setUserData(response.data);
            } catch (e) {
                console.error("Ошибка загрузки профиля:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [customerId]);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await axios.put(`http://localhost:8080/customers/${customerId}`, userData);
            alert("Данные успешно обновлены!");
        } catch (e) {
            alert("Не удалось сохранить изменения.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!userId) {
            alert("Критическая ошибка: ID пользователя не найден. Перезайдите в систему.");
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`http://localhost:8080/auth/delete/${userId}`);
            setShowDeleteConfirm(false);
            if (onLogout) onLogout();
        } catch (e) {
            alert("Ошибка при удалении аккаунта.");
        } finally {
            setLoading(false);
        }
    };

    if (!customerId) return <div className="loading-luxury">Синхронизация...</div>;

    return (
        <div className="profile-container-luxury fade-in">
            <div className="operations-grid">
                <div className={`op-card ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                    <span className="op-label">Мой профиль</span>
                    <div className="op-indicator"></div>
                </div>
                <div className={`op-card ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                    <span className="op-label">Мои заказы</span>
                    <div className="op-indicator"></div>
                </div>
            </div>

            <div className="form-container-luxury">
                {activeTab === 'info' && (
                    <div className="flower-form-clean fade-in">
                        <h2 className="form-title-luxury">Личные данные</h2>
                        <div className="form-grid">
                            <div className="input-field-luxury">
                                <label>Ваше Имя</label>
                                <input
                                    type="text"
                                    value={userData.name || ''}
                                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                                />
                            </div>
                            <div className="input-field-luxury">
                                <label>Контактный телефон</label>
                                <input
                                    type="text"
                                    value={userData.phoneNumber || ''}
                                    onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="profile-action-container">
                            <button className="submit-btn-luxury" onClick={handleUpdate} disabled={loading}>
                                {loading ? 'Сохранение...' : 'Обновить профиль'}
                                <div className="btn-line"></div>
                            </button>

                            <button className="delete-btn-luxury" onClick={() => setShowDeleteConfirm(true)}>
                                Удалить аккаунт
                                <div className="btn-line-red"></div>
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. Заменяем старую разметку на твой новый компонент */}
                {activeTab === 'orders' && (
                    <ManageOrders customerId={customerId} />
                )}
            </div>

            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content-luxury" onClick={e => e.stopPropagation()}>
                        <h3 className="form-title-luxury" style={{fontSize: '24px'}}>Вы уверены?</h3>
                        <p className="modal-text">Ваш логин и все данные профиля будут удалены навсегда.</p>
                        <div className="modal-actions-luxury">
                            <button className="modal-btn" onClick={() => setShowDeleteConfirm(false)}>Отмена</button>
                            <button className="modal-btn delete" onClick={handleDeleteAccount}>Да, удалить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;