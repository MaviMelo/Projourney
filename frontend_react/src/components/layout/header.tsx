import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, LogOut } from "lucide-react";
import SimpleLink from "../common/simpleLink";
import { Button } from "../ui/button";
import { APP_TITLE } from "@/config/api";
import { useTheme } from "../effects/themeProvider";
import { logout } from "@/lib/api";

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
 
    const isAuthenticated = !!localStorage.getItem('loggedUser');

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

        const handleLogout = async (full: boolean) => {
        await logout(full); 
        navigate('/login');
        closeMenu();
    };

    return (
        <header className="header relative">
            { isAuthenticated ? (
            <Link to="/perfil" className="itemsJustify group hover:opacity-90 transition-opacity">
                <img
                    src={theme === 'dark' ? "/spa/image/pj1.png" : "/spa/image/pj.png"}
                    alt="projourney logo" 
                    className="w-16 h-16"
                />
                <span className="title font-semibold m-2">{APP_TITLE}</span>
            </Link>
            ): (    
            <Link to="/" className="itemsJustify group hover:opacity-90 transition-opacity">
                <img
                    src={theme === 'dark' ? "/spa/image/pj1.png" : "/spa/image/pj.png"}
                    alt="projourney logo" 
                    className="w-16 h-16"
                />
                <span className="title font-semibold m-2">{APP_TITLE}</span>
            </Link>
            ) }
            <div className="flex items-center gap-2">
                <Button onClick={toggleMenu} variant="ghost" size="icon" className="rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label="Menu principal">
                    {isMenuOpen ? <X /> : <Menu />}
                </Button>

                <Button onClick={toggleTheme} variant="ghost" size="icon" className="rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-700" />}
                </Button>

                <div className="w-px h-6 bg-gray-400/50 mx-2 hidden sm:block"></div>

                {/* --- RENDERIZAÇÃO CONDICIONAL DOS BOTÕES --- */}
                {isAuthenticated ? (
                    <button 
                        onClick={() => handleLogout(false)}
                        className="px-6 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all hidden sm:flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                ) : (
                    <SimpleLink 
                        to="/login" 
                        className="px-6 py-2 rounded-lg font-bold text-white bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] shadow-md transition-all hidden sm:flex"
                    >
                        Entrar
                    </SimpleLink>
                )}
            </div>

            {isMenuOpen && (
                <nav className="absolute top-20 right-0 w-64 bg-white dark:bg-[#1a1a1a] shadow-2xl border border-gray-200 dark:border-gray-800 rounded-bl-xl flex flex-col p-4 gap-2 z-50">
                    
                    <div className="sm:hidden mb-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                         {isAuthenticated ? (
                            <button onClick={() => handleLogout(true)} className="w-full justify-center px-6 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all flex items-center gap-2">
                                <LogOut size={18} /> Sair em todos os dispositivos logados
                            </button>
                         ) : (
                            <div onClick={closeMenu}>
                                <SimpleLink to="/login" className="w-full justify-center px-6 py-3 rounded-lg font-bold text-white bg-[hsl(var(--button-1))] hover:bg-[hsl(var(--button-1-foreground))] shadow-md transition-all flex">
                                    Entrar
                                </SimpleLink>
                            </div>
                         )}
                    </div>

                    <div onClick={closeMenu}><SimpleLink to="/cursos" className="block p-3 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cursos</SimpleLink></div>
                    <div onClick={closeMenu}><SimpleLink to="/sobre" className="block p-3 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Sobre o projeto</SimpleLink></div>
                    {isAuthenticated && (
                    <div onClick={closeMenu}><SimpleLink to="/trilhas" className="block p-3 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Trilhas</SimpleLink></div>
                    )}
                    {isAuthenticated && (
                                            <button 
                        onClick={() => handleLogout(true)}
                        className="px-6 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all hidden sm:flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        Sair em todos os dispositivos
                    </button>
                    )}
                </nav>
            )}
        </header>
    );
}