import userIcon from '../assets/user.png'; 
import './Navbar.css'
export default function Navbar() {
    return (
        <header className="header">
        <input type="text" placeholder="Buscar..." className="search-input" />
        <div className="user-info">
            <img src={userIcon} alt="Usuario" className="user-avatar" />
            
            <div>
            <strong>Totok Mireia</strong>
            <p>mireiatotok@mail.com</p>
            </div>
        </div>
        </header>
    );
}