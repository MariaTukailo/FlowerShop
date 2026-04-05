import lili from '../assets/lili.png'
import points from '../assets/points.png'
import './Header.css'
// Мы передаем isAdmin и setIsAdmin как "пропсы" (аргументы),
// чтобы кнопка могла менять состояние, которое лежит в App.jsx
function Header({ isAdmin, setIsAdmin }) {
    return (
        <header className="hero-section">
            <button
                className="admin-toggle-btn"
                onClick={() => setIsAdmin(!isAdmin)}
            >
                {isAdmin ? "Администратор" : "Пользователь"}
            </button>

            <img src={points} alt="pattern" className="dots-image" />
            <h1 className="logo-text">Flower Shop</h1>
            <img src={lili} alt="lili" className="lili-image" />
        </header>
    );
}

export default Header;