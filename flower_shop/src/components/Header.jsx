import lili from '../assets/lili.png'
import points from '../assets/points.png'
import './Header.css'

function Header({ user }) {

    const isAdmin = user?.role === 'ADMIN';

    return (
        <header className="hero-section">


            <img src={points} alt="pattern" className="dots-image" />
            <h1 className="logo-text">Flower Shop</h1>
            <img src={lili} alt="lili" className="lili-image" />
        </header>
    );
}

export default Header;