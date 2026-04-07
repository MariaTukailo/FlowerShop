import React, { useState, useEffect } from 'react';
import api from '../../api';
import FlowerGallery from '../FlowerGallery';
import './ManageFlowers.css';

const ManageFlowers = () => {
    // 1. Создаем стейт для цветов прямо здесь
    const [flowers, setFlowers] = useState([]);
    const [activeOperation, setActiveOperation] = useState('findAll');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFlower, setEditingFlower] = useState(null);

    const [flowerData, setFlowerData] = useState({
        name: '', price: '', active: true, pathPhoto: '', color: 'красный'
    });

    const colorOptions = ['белый', 'желтый', 'розовый', 'красный', 'зеленый', 'черный'];

    // 2. Загружаем цветы при старте
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await api.get('/flowers');
                setFlowers(response.data);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
            }
        };
        fetchAll();
    }, []);

    const handleEditClick = (flower) => {
        setEditingFlower(flower);
        setFlowerData({ ...flower }); // Копируем данные, чтобы не менять оригинал сразу
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingFlower(null);
        setFlowerData({ name: '', price: '', active: true, pathPhoto: '', color: 'красный' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFlower(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFlowerData(prev => ({ ...prev, [name]: val }));
    };

    // 3. УМНОЕ ОБНОВЛЕНИЕ БЕЗ ПЕРЕЗАГРУЗКИ
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...flowerData, price: Number(flowerData.price) };

            if (editingFlower) {
                // Если редактируем (используем PUT или PATCH)
                const response = await api.put(`/flowers/${editingFlower.id}`, payload);

                // Обновляем массив цветов: заменяем старый цветок новым из ответа сервера
                setFlowers(prev => prev.map(f => f.id === editingFlower.id ? response.data : f));
                alert("Данные успешно обновлены ✨");
            } else {
                // Если создаем новый
                const response = await api.post('/flowers', payload);

                // Добавляем новый цветок в список
                setFlowers(prev => [...prev, response.data]);
                alert("Цветок успешно добавлен!");
            }

            closeModal();
            // window.location.reload(); <-- УДАЛЕНО! Теперь тебя не выкинет.
        } catch (error) {
            console.error(error);
            alert("Ошибка при сохранении.");
        }
    };

    return (
        <div className="flowers-admin-panel">
            <div className="operations-grid">
                <div className={`op-card ${activeOperation === 'findAll' ? 'active' : ''}`} onClick={() => setActiveOperation('findAll')}>
                    <span className="op-label">Ассортимент</span>
                    <div className="op-indicator"></div>
                </div>
                <div className="op-card" onClick={handleAddClick}>
                    <span className="op-label">Добавить новый</span>
                    <div className="op-indicator"></div>
                </div>
            </div>

            <div className="operation-content">
                {/* 4. Передаем наш стейт 'flowers' в галерею */}
                <FlowerGallery
                    flowers={flowers}
                    isAdmin={true}
                    onEdit={handleEditClick}
                />
            </div>

            {/* ... остальная часть с модальным окном и формой без изменений ... */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal}>&times;</button>

                        <form className="flower-form-clean" onSubmit={handleSubmit}>
                            <h2 className="form-title-luxury">
                                {editingFlower ? 'Редактирование' : 'Новый цветок'}
                            </h2>

                            <div className="form-grid">
                                <div className="input-field-luxury full-width">
                                    <label>Название</label>
                                    <input
                                        name="name"
                                        type="text"
                                        value={flowerData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="input-field-luxury">
                                    <label>Цена (BYN)</label>
                                    <input
                                        name="price"
                                        type="number" step="0.01"
                                        value={flowerData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="input-field-luxury">
                                    <label>Оттенок</label>
                                    <select
                                        name="color"
                                        className="flower-select-luxury"
                                        value={flowerData.color}
                                        onChange={handleInputChange}
                                    >
                                        {colorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="input-field-luxury full-width">
                                    <label>URL фотографии</label>
                                    <input
                                        name="pathPhoto"
                                        type="text"
                                        value={flowerData.pathPhoto || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input-field-luxury full-width">
                                    <label className="status-toggle-wrapper">
                                        <input
                                            name="active"
                                            type="checkbox"
                                            checked={flowerData.active}
                                            onChange={handleInputChange}
                                        />
                                        <span>Доступен для продажи</span>
                                    </label>
                                </div>
                            </div>

                            <div className="center-text" style={{marginTop:'30px'}}>
                                <button type="submit" className="submit-btn-luxury">
                                    {editingFlower ? 'Сохранить изменения' : 'Добавить цветок'}
                                    <div className="btn-line"></div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFlowers;