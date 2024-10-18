import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Gate() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/c');
    }, []);
    return '';
}

export default Gate;
