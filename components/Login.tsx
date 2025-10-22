
import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

interface LoginProps {
    onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { addToast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'nouah' && password === 'nouah') {
            addToast('تم تسجيل الدخول بنجاح!', 'success');
            onLoginSuccess();
        } else {
            addToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    تسجيل دخول المدير
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">اسم المستخدم</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105"
                        >
                            تسجيل الدخول
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
