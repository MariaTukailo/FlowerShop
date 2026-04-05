import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import UserView from './components/UserView'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'

function App() {
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="main-container">
            <Header user={user} onLogout={handleLogout} />

            <main className="content-area">
                {!user ? (
                    <Login onLoginSuccess={(userData) => setUser(userData)} />
                ) : (
                    // ИСПРАВЛЕНО: передаем user={user} в AdminPanel
                    user.role === 'ADMIN'
                        ? <AdminPanel user={user} onLogout={handleLogout} />
                        : <UserView user={user} onLogout={handleLogout} />
                )}
            </main>
        </div>
    )
}

export default App;