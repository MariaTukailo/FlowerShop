import React, { useState } from 'react';
import './AdminPanel.css';
import ManageFlowers from './admin/ManageFlowers';
import ManageBouquets from './admin/ManageBouquets';
import ManageCustomers from './admin/ManageCustomers';
import ManageOrders from './admin/ManageOrders';

function AdminPanel() {
    const [adminTab, setAdminTab] = useState('flowers');

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <button
                    className={adminTab === 'flowers' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setAdminTab('flowers')}
                >
                    Цветы
                </button>
                <button
                    className={adminTab === 'bouquets' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setAdminTab('bouquets')}
                >
                    Букеты
                </button>
                <button
                    className={adminTab === 'customers' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setAdminTab('customers')}
                >
                    Покупатели
                </button>
                <button
                    className={adminTab === 'orders' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setAdminTab('orders')}
                >
                    Заказы
                </button>
            </nav>

            <div className="admin-content">
                <div className="admin-action-area">
                    {adminTab === 'flowers' && <ManageFlowers />}
                    {adminTab === 'bouquets' && <ManageBouquets />}
                    {adminTab === 'customers' && <ManageCustomers />}
                    {adminTab === 'orders' && <ManageOrders />}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;