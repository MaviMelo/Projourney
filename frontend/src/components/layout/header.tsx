import Dropdown from "../common/dropdown"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../effects/theme-provider"
import SimpleLink from "../common/simpleLink"
import { Button } from "../ui/button"

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b border-blue-200 dark:border-blue-500/40
        bg-blue-100/90 dark:bg-blue-900/80
        supports-[backdrop-filter]:backdrop-blur-md
        px-4 md:px-8 lg:px-16 xl:px-20
        py-2
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/image/pj1.png"
            alt="ProJourney"
            className="w-12 h-12 object-contain"
          />

          <Dropdown
            label="PROJOURNEY"
            className="
              text-xl md:text-2xl font-bold
              text-blue-800 dark:text-blue-200
            "
          />
        </div>

        <nav className="flex items-center gap-4 md:gap-6">
          <SimpleLink to="/cursos" variant="nav">
            Cursos
          </SimpleLink>

          <SimpleLink to="/trilhas" variant="nav">
            Trilhas
          </SimpleLink>

          <SimpleLink to="/sobre" variant="nav">
            Sobre
          </SimpleLink>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="
              rounded-full
              hover:bg-blue-200
              dark:hover:bg-blue-800
            "
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-700" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  )
}
