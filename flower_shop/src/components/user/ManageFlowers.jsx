import React from 'react';
import FlowerGallery from '../FlowerGallery';
import './UserFlowers.css';

const UserFlowers = () => {
    return (
        <div className="user-flowers-page">
            <header className="user-header">
                <h1 className="user-page-title">Наш Ассортимент</h1>
                <p className="user-page-subtitle">Свежие цветы с доставкой до вашей двери</p>
            </header>

            <main className="user-content">
                {/* Вызываем общий компонент.
                    isAdmin={false} скроет техническую информацию */}
                <FlowerGallery isAdmin={false} />
            </main>
        </div>
    );
};

export default UserFlowers;