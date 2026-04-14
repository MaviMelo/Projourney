// src/components/layout/layout.tsx

import {Outlet} from 'react-router-dom';
import Header from './header';


export default function Layout() {
    return (
        <div className="inline-block min-w-full min-h-screen bg-background text-foreground">
            <Header />
            <main>
                <Outlet/> {/* Renderiza o componente da rota filha aqui */}
            </main>
        </div>
    )
}
