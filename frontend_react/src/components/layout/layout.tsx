// src/components/layout/layout.tsx

import {Outlet} from 'react-router-dom';
import Header from './header';
import ParticleBackground from '../effects/particlebackground';


export default function Layout() {
    return (
        <>
        <div className="min-h-screen relative z-[0]">
            <ParticleBackground />
            <Header />

            <main>
                <Outlet/> {/* Renderiza o componente da rota filha aqui */}
            </main>
        </div>
        </>
    )
}