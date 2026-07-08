import React from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from '@/lib/api';
import { MoreVertical, LogOut } from "lucide-react";

export function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(false);
            navigate('/login');
        } catch (error) {
            console.error('Falha na requisição de logout:', error);
            navigate('/login');
        };
    };

    const handleFullLogout = async () => {
        try {
            await logout(true);
            navigate('/login');
        } catch (error) {
            console.error('Falha na requisição de logout total:', error);
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
                        Sair em todos os dispositivos
                        🖥️ 📱 💻
                    </button>


                </div>
            </details>
        </div>

    );
}