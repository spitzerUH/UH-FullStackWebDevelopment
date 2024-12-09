import React from 'react';

const UserBar = ({ user, handleLogout }) => {
    return (
        <p>
            <span>{`Logged in as ${user.name}`}</span>
            <button onClick={handleLogout}>Logout</button>
        </p>
    );
};

export default UserBar;