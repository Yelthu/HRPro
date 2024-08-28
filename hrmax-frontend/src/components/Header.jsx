import React from 'react';
//import logo from './path-to-your-logo.png'; // Adjust the path as needed

const Header = () => {
    return (
        <div className="absolute top-4 left-4 h-16 ">
            <img src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your company" className="h-16" />
        </div>
    );
};

export default Header;