// src/pages/homePage.tsx

import type { JSX } from "react/jsx-runtime"
import ParticleBackground from "@/components/effects/particlebackground"
import SimpleLink from "../components/common/simpleLink"


export default function HomePage(): JSX.Element {
    return (
        <div className=" text-white font-['Poppins',Arial,sans-serif]">
            <ParticleBackground />
            
            <div className="m-6 flex justify-end space-x-6">
                <SimpleLink to="/login" variant="navButton">
                    Entrar
                </SimpleLink>
                <SimpleLink to="/cadastrar" variant="navButton">
                    Cadastrar
                </SimpleLink>
            </div>

            {/* Hero Section */}
            <main className=" m-[10%]">
                <section className=" relative z-10 flex flex-col items-center justify-center  px-8 py-24 text-center ">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight drop-shadow-lg">
                        Prepare-se para sua formação de forma inteligente
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                        Varias trilhas de cursos de tecnologia, redirecionamento para plataformas de cursos on-line grátis e muito mais.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <SimpleLink to="Login" variant="outline">
                            Comece agora. Tudo de forma gratuita!
                        </SimpleLink>
                    </div>
                </section>
            </main>
        </div>
    )
}

