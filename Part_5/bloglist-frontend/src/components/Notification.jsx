import React from 'react';

const Notification = ({ message, isError = false }) => {
    if (!message) {
        return "";
    }

    const notificationStyle = {
        color: isError ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    };

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    );
};

export default Notification;