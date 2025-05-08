import React from 'react'
import {withRouter, Link } from 'react-router-dom'
const Navbar = ({ location, userType, user}) => {

    const isActive = (route) => {
        return location.pathname === route ? "active-page" : undefined;
      };

    const toggleActive = () => {
        const navbarLinks = document.getElementsByClassName('navbar-links')[0];
        navbarLinks.classList.toggle('active')
    }

    return (
        <nav className="navbar">
            <div className="brand-name">Impericion</div>
            <button onClick={() => toggleActive()} className="toggle-button">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            <div className="navbar-links">
                <ul>
                    <li>
                        <Link to="/" className={isActive("/")}>Browse</Link>
                    </li>
                    {user ?
                        <li>
                            <Link to="/chat" className={isActive("/chat")}>Chat</Link>
                        </li>
                        : ''}
                    {user ?
                        <li>
                            <Link to="/wishlist" className={isActive("/wishlist")}>Wishlist</Link>
                        </li>
                        : ''}
                    {userType === 'admin' ?
                    <li>
                        <Link to="/admin" className={isActive("/admin")}>Admin Panel</Link>
                    </li>
                    : '' }
                    <li>
                        {user ?
                            <Link to="/logout" className={isActive("/login")}>Logout</Link> :
                            <Link to="/login" className={isActive("/login")}>Login</Link>
                        }
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default withRouter(Navbar)