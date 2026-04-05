import React, { useState } from 'react';
import axios from 'axios';
import FlowerGallery from '../FlowerGallery'; // Тот самый общий компонент
import './ManageFlowers.css';

const ManageFlowers = () => {
    // Оставляем только те состояния, которые нужны для УПРАВЛЕНИЯ
    const [activeOperation, setActiveOperation] = useState('findAll');

    // Состояние для редактирования
    const [editingFlower, setEditingFlower] = useState(null);
    const [editId, setEditId] = useState('');

    // Состояние для НОВОГО цветка
    const [newFlower, setNewFlower] = useState({
        name: '',
        price: '',
        active: true,
        pathPhoto: '',
        color: 'красный'
    });

    const colorOptions = ['белый', 'желтый', 'розовый', 'красный', 'зеленый', 'черный'];

    // Создание нового цветка
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/flowers', {
                ...newFlower,
                price: Number(newFlower.price)
            });
            alert("Цветок успешно добавлен в базу!");
            setNewFlower({ name: '', price: '', active: true, pathPhoto: '', color: 'красный' });
            setActiveOperation('findAll'); // Возвращаемся к списку после создания
        } catch (error) {
            alert("Ошибка валидации! Проверьте данные.");
        }
    };

    // Поиск цветка для редактирования
    const findForEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8080/flowers/${editId}`);
            setEditingFlower(response.data);
        } catch (error) {
            alert("Цветок с таким ID не найден");
        }
    };

    // Сохранение изменений
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/flowers/${editingFlower.id}`, editingFlower);
            alert("Данные обновлены");
            setEditingFlower(null);
            setActiveOperation('findAll'); // Возвращаемся к списку после обновления
        } catch (error) {
            alert("Ошибка при обновлении");
        }
    };

    return (
        <div className="flowers-admin-panel">
            {/* Навигация админа */}
            <div className="operations-grid">
                <button className={`op-card ${activeOperation === 'findAll' ? 'active' : ''}`} onClick={() => setActiveOperation('findAll')}>
                    <span className="op-label">Ассортимент</span>
                    <div className="op-indicator"></div>
                </button>
                <button className={`op-card ${activeOperation === 'create' ? 'active' : ''}`} onClick={() => setActiveOperation('create')}>
                    <span className="op-label">Добавить новый</span>
                    <div className="op-indicator"></div>
                </button>
                <button className={`op-card ${activeOperation === 'update' ? 'active' : ''}`} onClick={() => setActiveOperation('update')}>
                    <span className="op-label">Редактировать</span>
                    <div className="op-indicator"></div>
                </button>
            </div>

            <div className="operation-content">
                {/* 1. ПОКАЗАТЬ ВСЕ И ФИЛЬТРАЦИЯ (ВЫНЕСЕНО В ОБЩИЙ КОМПОНЕНТ) */}
                {activeOperation === 'findAll' && (
                    <FlowerGallery isAdmin={true} />
                )}

                {/* 2. СОЗДАНИЕ (ОСТАЛОСЬ ТУТ) */}
                {activeOperation === 'create' && (
                    <div className="form-container-luxury fade-in">
                        <form className="flower-form-clean" onSubmit={handleCreateSubmit}>
                            <div className="form-header">
                                <h2 className="form-title-luxury">Новый цветок</h2>
                            </div>
                            <div className="form-grid">
                                <div className="input-field-luxury">
                                    <label>Название</label>
                                    <input type="text" value={newFlower.name} onChange={(e) => setNewFlower({...newFlower, name: e.target.value})} required placeholder="от 2 до 30 симв." />
                                </div>
                                <div className="input-field-luxury">
                                    <label>Цена (BYN)</label>
                                    <input type="number" step="0.01" value={newFlower.price} onChange={(e) => setNewFlower({...newFlower, price: e.target.value})} required />
                                </div>
                                <div className="input-field-luxury">
                                    <label>Оттенок</label>
                                    <select value={newFlower.color} onChange={(e) => setNewFlower({...newFlower, color: e.target.value})}>
                                        {colorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="input-field-luxury">
                                    <label>Статус</label>
                                    <select value={newFlower.active} onChange={(e) => setNewFlower({...newFlower, active: e.target.value === 'true'})}>
                                        <option value="true">Активен (в продаже)</option>
                                        <option value="false">Скрыт</option>
                                    </select>
                                </div>
                                <div className="input-field-luxury full-width">
                                    <label>URL фотографии</label>
                                    <input type="text" value={newFlower.pathPhoto} onChange={(e) => setNewFlower({...newFlower, pathPhoto: e.target.value})} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn-luxury">Добавить в базу <div className="btn-line"></div></button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 3. РЕДАКТИРОВАНИЕ (ОСТАЛОСЬ ТУТ) */}
                {activeOperation === 'update' && (
                    <div className="form-container-luxury fade-in">
                        {!editingFlower ? (
                            <form className="search-form-luxury" onSubmit={findForEdit}>
                                <div className="search-container-inner">
                                    <span className="search-hint">Введите ID для редактирования</span>
                                    <div className="search-field-group">
                                        <input type="number" className="search-input-clean" value={editId} onChange={(e) => setEditId(e.target.value)} required />
                                        <button type="submit" className="search-action-btn">Найти <div className="btn-underline"></div></button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form className="flower-form-clean" onSubmit={handleUpdate}>
                                <div className="form-header">
                                    <h2 className="form-title-luxury">Редактирование цветка: #{editingFlower.id}</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="input-field-luxury">
                                        <label>Название</label>
                                        <input type="text" value={editingFlower.name} onChange={(e) => setEditingFlower({...editingFlower, name: e.target.value})} />
                                    </div>
                                    <div className="input-field-luxury">
                                        <label>Цена</label>
                                        <input type="number" step="0.01" value={editingFlower.price} onChange={(e) => setEditingFlower({...editingFlower, price: e.target.value})} />
                                    </div>
                                    <div className="input-field-luxury">
                                        <label>Цвет</label>
                                        <select value={editingFlower.color} onChange={(e) => setEditingFlower({...editingFlower, color: e.target.value})}>
                                            {colorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-field-luxury">
                                        <label>Статус</label>
                                        <select value={editingFlower.active} onChange={(e) => setEditingFlower({...editingFlower, active: e.target.value === 'true'})}>
                                            <option value="true">Активен</option>
                                            <option value="false">Скрыт</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions" style={{gap:'20px'}}>
                                    <button type="submit" className="submit-btn-luxury">Сохранить <div className="btn-line"></div></button>
                                    <button type="button" className="submit-btn-luxury" onClick={() => setEditingFlower(null)}>Назад <div className="btn-line"></div></button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageFlowers;