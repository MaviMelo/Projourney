//src/components/layout/header.tsx

import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "../effects/theme-provider"
import SimpleLink from "../common/simpleLink"
import { Button } from "../ui/button"
import {APP_TITLE} from "@/config/api"

{/* Header */ }
export default function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="header">

            <div className=" itemsJustify">
                {theme === 'dark' ? (
                    <img
                        src="/image/pj1.png"
                        alt="projourney logo" className="w-16 h-16"
                    />

                ) : (

                    <img
                        src="/image/pj.png"
                        alt="projourney logo" className="w-16 h-16"
                    />
                )}

                <a
                    className="title buttonLink"
                    href="/perfil"
                >
                {`${APP_TITLE}`}
                </a>
            </div>
            <nav className=" itemsJustify">
                <SimpleLink to="/cursos" variant="navLink">
                    Cursos
                </SimpleLink>
                <SimpleLink to="/trilhas" variant="navLink">
                    Trilhas
                </SimpleLink>
                <SimpleLink to="/sobre" variant="navLink">
                    Sobre
                </SimpleLink>
                <Button onClick={toggleTheme} variant="ghost" size="icon">
                    {theme === 'dark' ? (
                        <Sun />
                    ) : (
                        <Moon />
                    )}
                </Button>
            </nav>

        </header>
    )
}

