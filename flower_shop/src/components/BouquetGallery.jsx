import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './BouquetGallery.css';

const BouquetGallery = ({ isAdmin = false, user }) => {
    const [bouquets, setBouquets] = useState([]);
    const [availableFlowers, setAvailableFlowers] = useState([]);
    const [openedComposition, setOpenedComposition] = useState(null); // Для раскрытия состава

    const customerId = user?.customerId || user?.customer?.id || user?.id;

    const [searchId, setSearchId] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [filterWrapping, setFilterWrapping] = useState('ALL');
    const [filterRibbon, setFilterRibbon] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedFlowerFilters, setSelectedFlowerFilters] = useState([]);
    const [isFilterFlowersOpen, setIsFilterFlowersOpen] = useState(false);
    const filterDropdownRef = useRef(null);

    const toggleComposition = (id) => {
        setOpenedComposition(openedComposition === id ? null : id);
    };

    const handleAddToCart = async (bouquetId) => {
        if (!customerId) {
            alert("Пожалуйста, войдите в систему.");
            return;
        }
        try {
            await axios.post(`http://localhost:8080/carts/${customerId}/add/${bouquetId}`);
            alert("Букет добавлен в корзину! 🌸");
        } catch (error) {
            console.error("Ошибка при добавлении:", error);
            alert("Не удалось добавить в корзину.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bRes = await axios.get('http://localhost:8080/bouquets');
                setBouquets(bRes.data);
                const fRes = await axios.get('http://localhost:8080/flowers');
                setAvailableFlowers(fRes.data);
            } catch (e) { console.error("Ошибка загрузки:", e); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target))
                setIsFilterFlowersOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const toggleFlowerFilter = (id) => {
        setSelectedFlowerFilters(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const filteredBouquets = bouquets.filter(b => {
        const matchesId = searchId ? b.id.toString().includes(searchId) : true;
        const matchesName = b.name.toLowerCase().includes(filterName.toLowerCase());
        const matchesPrice = filterPrice ? b.price <= Number(filterPrice) : true;
        const matchesWrapping = filterWrapping === 'ALL' || (filterWrapping === 'YES' ? b.wrappingPaper : !b.wrappingPaper);
        const matchesRibbon = filterRibbon === 'ALL' || (filterRibbon === 'YES' ? b.ribbon : !b.ribbon);
        const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'ACTIVE' ? b.active : !b.active);
        const matchesFlowers = selectedFlowerFilters.length === 0 ||
            selectedFlowerFilters.every(fId => b.flowers?.some(f => f.id === fId));

        return matchesId && matchesName && matchesPrice && matchesWrapping && matchesRibbon && matchesStatus && matchesFlowers && (isAdmin ? true : b.active);
    });

    return (
        <div className="bouquet-gallery-container fade-in">
            <div className="luxury-filter-panel">
                <div className="filter-group">
                    <span className="filter-hint">ID</span>
                    <input type="number" className="filter-input-short" value={searchId} onChange={(e)=>setSearchId(e.target.value)} placeholder="0" />
                </div>
                <div className="filter-group">
                    <span className="filter-hint">Название</span>
                    <input type="text" className="filter-input-medium" value={filterName} onChange={(e)=>setFilterName(e.target.value)} placeholder="Поиск..." />
                </div>
                <div className="filter-group">
                    <span className="filter-hint">Цена до</span>
                    <input type="number" className="filter-input-short" value={filterPrice} onChange={(e)=>setFilterPrice(e.target.value)} placeholder="BYN" />
                </div>
                <div className="filter-group" ref={filterDropdownRef}>
                    <span className="filter-hint">Состав (фильтр)</span>
                    <div className="filter-select-luxury custom-select-trigger" onClick={() => setIsFilterFlowersOpen(!isFilterFlowersOpen)}>
                        {selectedFlowerFilters.length > 0 ? `Выбрано: ${selectedFlowerFilters.length}` : 'Все цветы'}
                        <span className="arrow-mini">▼</span>
                    </div>
                    {isFilterFlowersOpen && (
                        <div className="luxury-dropdown-box fade-in">
                            {availableFlowers.map(f => (
                                <label key={f.id} className="luxury-checkbox-item">
                                    <input type="checkbox" checked={selectedFlowerFilters.includes(f.id)} onChange={() => toggleFlowerFilter(f.id)} />
                                    <span className="flower-name">{f.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bouquets-grid">
                {filteredBouquets.map(b => (
                    <div key={b.id} className="bouquet-card">
                        <div className="card-image-wrapper">
                            <img src={b.pathPhoto || 'https://via.placeholder.com/300'} alt={b.name} className="card-img" />
                            {isAdmin && (
                                <span className={`card-status-badge ${b.active ? 'active' : 'hidden'}`}>
                                    {b.active ? 'Доступен' : 'Архив'}
                                </span>
                            )}
                        </div>
                        <div className="card-content">
                            <div className="card-info-top">
                                <span>B-ID: {b.id}</span>
                                <button className="composition-toggle-btn" onClick={() => toggleComposition(b.id)}>
                                    {openedComposition === b.id ? 'Скрыть состав' : 'Показать состав'}
                                </button>
                            </div>
                            <h3 className="card-title">{b.name}</h3>

                            {/* РАСКРЫВАЮЩИЙСЯ СОСТАВ (Many-to-Many) */}
                            {openedComposition === b.id && (
                                <div className="composition-details fade-in">
                                    <p className="composition-title">В этом букете:</p>
                                    <ul className="composition-list">
                                        {b.flowers && b.flowers.length > 0 ? (
                                            b.flowers.map((f, i) => (
                                                <li key={i}>• {f.name} <span className="f-color">({f.color})</span></li>
                                            ))
                                        ) : (
                                            <li>Состав уточняется</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div className="card-details">
                                {b.wrappingPaper && <span className="detail-tag">Бумага</span>}
                                {b.ribbon && <span className="detail-tag">Лента</span>}
                            </div>

                            <div className="card-footer-flex">
                                <p className="card-price">{b.price} BYN</p>
                                {!isAdmin && (
                                    <button className="add-to-cart-btn-luxury" onClick={() => handleAddToCart(b.id)}>+</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BouquetGallery;