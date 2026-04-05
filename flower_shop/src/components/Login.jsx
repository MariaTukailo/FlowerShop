import { useState } from 'react';

function Login({ onLoginSuccess }) {
    const [isRegister, setIsRegister] = useState(false); // Переключатель Вход/Регистрация
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', phone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegister ? '/auth/register' : '/auth/login';

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                onLoginSuccess(data); // Передаем данные юзера в App.jsx
            } else {
                alert('Ошибка! Проверьте данные');
            }
        } catch (error) {
            alert('Сервер недоступен');
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-card">
                <h2>{isRegister ? 'Регистрация' : 'Вход в магазин'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Логин"
                        onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />

                    {isRegister && (
                        <>
                            <input
                                placeholder="Ваше имя"
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                            <input
                                placeholder="Телефон"
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </>
                    )}

                    <button type="submit">{isRegister ? 'Создать аккаунт' : 'Войти'}</button>
                </form>

                <p onClick={() => setIsRegister(!isRegister)} className="toggle-auth">
                    {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </p>
            </div>
        </div>
    );
}

export default Login;