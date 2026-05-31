import React from 'react';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '@/config/api';
import { User, BookOpen, MoreVertical, Loader2, AlertCircle, CheckCircle, LogOut, Trash2 } from "lucide-react";

export function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("Token de autenticação não encontrado.");
            localStorage.removeItem('loggedUser');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },

            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                localStorage.removeItem('loggedUser');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error('Erro ao fazer logout. Por segurança use o recurso de logout total assim que possível. Erro:', errorData.message);
                localStorage.removeItem('loggedUser');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            console.error('Falha na requisição de logout. Por segurança use o recurso de logout total assim que possível. Erro:', error);
            localStorage.removeItem('loggedUser');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        };

    };

    
    // Logout em todos os dispositivos

    const handleFullLogout = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("Token de autenticação não encontrado.");
            localStorage.removeItem('loggedUser');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/fullLogout`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },

            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                localStorage.removeItem('loggedUser');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error('Erro ao fazer logout. Por segurança use o recurso de logout total assim que possível. Erro:', errorData.message);
                localStorage.removeItem('loggedUser');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            console.error('Falha na requisição de logout. Por segurança use o recurso de logout total assim que possível. Erro:', error);
            localStorage.removeItem('loggedUser');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        };
    };

    return (



        <div className="text-white mt-6 relative">
            <details className="group">
                <summary className="buttonNav">
                    <span>Sair</span>
                    <MoreVertical size={20} />
                </summary>
                <div className=" dropDown centralize2">

                    <button onClick={handleLogout} className="buttonNav">
                        <LogOut size={16} />
                        Sair
                    </button>


                    <button onClick={handleFullLogout} className="buttonNav">
                        {/* <LogOut size={16} /> */}
                        Sair em todos os dispositivos
                        🖥️ 📱 💻
                    </button>


                </div>
            </details>
        </div>

    );

}