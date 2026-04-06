import { useState } from 'react';
import api from '../api';

function Login({ onLoginSuccess }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', phone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegister ? '/auth/register' : '/auth/login';

        try {
            const response = await api.post(endpoint, formData);
            onLoginSuccess(response.data);
        } catch (error) {
            if (error.response) {
                alert('Ошибка: ' + (error.response.data.message || 'Проверьте данные'));
            } else {
                alert('Сервер недоступен');
            }
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-card">
                <h2>{isRegister ? 'Регистрация' : 'Вход в магазин'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Логин"
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />

                    {isRegister && (
                        <>
                            <input
                                placeholder="Ваше имя"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                            <input
                                placeholder="Телефон"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </>
                    )}

                    <button type="submit">{isRegister ? 'Создать аккаунт' : 'Войти'}</button>
                </form>

                <p onClick={() => setIsRegister(!isRegister)} className="toggle-auth" style={{cursor: 'pointer'}}>
                    {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </p>
            </div>
        </div>
    );
}

export default Login;