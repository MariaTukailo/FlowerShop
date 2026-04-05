import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FlowerGallery.css';

const FlowerGallery = ({ isAdmin = false }) => {
    const [flowers, setFlowers] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterColor, setFilterColor] = useState('all');
    const [filterPrice, setFilterPrice] = useState('');
    const [showOnlyActive, setShowOnlyActive] = useState(isAdmin ? false : true);

    const colorMap = {
        'белый': 'white',
        'желтый': 'yellow',
        'розовый': 'pink',
        'красный': 'red',
        'зеленый': 'green',
        'черный': 'black'
    };

    const colorOptions = Object.keys(colorMap);

    const fetchFlowers = async () => {
        try {
            // ЛОГИКА ПОИСКА ПО КОНКРЕТНОМУ ID (Твой метод findById)
            if (searchId && searchId !== '0') {
                try {
                    const response = await axios.get(`http://localhost:8080/flowers/${searchId}`);
                    // Контроллер возвращает FlowerDto (один объект), оборачиваем в массив
                    setFlowers(response.data ? [response.data] : []);
                } catch (err) {
                    // Если 404 или ошибка — список пустой
                    setFlowers([]);
                }
                return; // Выходим, чтобы не загружать весь список
            }

            // ОБЫЧНАЯ ЗАГРУЗКА (findAll / findAllActive)
            const endpoint = showOnlyActive ? '/active' : '';
            const response = await axios.get(`http://localhost:8080/flowers${endpoint}`);
            setFlowers(response.data);
        } catch (error) {
            console.error("Ошибка загрузки:", error);
            setFlowers([]);
        }
    };

    // Перезагружаем данные при изменении ID или фильтров активности
    useEffect(() => {
        fetchFlowers();
    }, [showOnlyActive, isAdmin, searchId]);

    // ФИЛЬТРАЦИЯ (теперь только по имени, цвету и цене, так как ID фильтруется запросом)
    const filteredFlowers = flowers.filter(f => {
        const matchesName = !filterName || f.name.toLowerCase().includes(filterName.toLowerCase());
        const matchesPrice = !filterPrice || f.price <= Number(filterPrice);

        const selectedRussian = filterColor.toLowerCase();
        const flowerDbValue = f.color ? f.color.toLowerCase() : '';
        const selectedEnglish = colorMap[selectedRussian] || 'all';
        const matchesColor = (selectedRussian === 'all') || (flowerDbValue === selectedEnglish);

        return matchesName && matchesColor && matchesPrice;
    });

    return (
        <div className="flower-gallery-container fade-in">
            <div className="luxury-filter-panel">
                <div className="filter-group">
                    <span className="filter-hint">ID</span>
                    <input
                        type="number"
                        className="filter-input-short"
                        placeholder="ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                </div>
                {/* Остальные фильтры остаются такими же */}
                <div className="filter-group">
                    <span className="filter-hint">Название</span>
                    <input type="text" className="filter-input-medium" placeholder="Поиск..." value={filterName} onChange={(e) => setFilterName(e.target.value)} />
                </div>
                <div className="filter-group">
                    <span className="filter-hint">Цена до</span>
                    <input type="number" className="filter-input-short" value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)} />
                </div>
                <div className="filter-group">
                    <span className="filter-hint">Цвет</span>
                    <select className="filter-select-luxury" value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
                        <option value="all">все цвета</option>
                        {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                {isAdmin && (
                    <div className="filter-group">
                        <span className="filter-hint">Режим</span>
                        <button className={`status-toggle-btn ${showOnlyActive ? 'active' : ''}`} onClick={() => setShowOnlyActive(!showOnlyActive)}>
                            {showOnlyActive ? 'В продаже' : 'Все'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flowers-grid">
                {filteredFlowers.length > 0 ? (
                    filteredFlowers.map(f => (
                        <div key={f.id} className="flower-card">
                            <div className="card-image-wrapper">
                                <img src={f.pathPhoto || 'https://via.placeholder.com/300'} alt={f.name} className="card-img" />
                                {isAdmin && <span className={`card-status-badge ${f.active ? 'active' : 'hidden'}`}>{f.active ? 'В продаже' : 'Скрыт'}</span>}
                            </div>
                            <div className="card-content">
                                <div className="card-info-top">
                                    <span>ID: {f.id}</span>
                                    <span className="flower-color-tag">{f.color}</span>
                                </div>
                                <h3 className="card-title">{f.name}</h3>
                                <p className="card-price">{f.price} BYN</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results-container">
                        <p className="no-results-text">Цветок с таким ID не найден 🌸</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlowerGallery;