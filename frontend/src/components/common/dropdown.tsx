import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, LogIn } from "lucide-react"

type DropdownProps = {
  label: string
}

export default function Dropdown({ label }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado")
    navigate("/login")
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="
          text-xl md:text-2xl font-bold text-[#00aaff]
          transition-colors
          focus-visible:outline-none
          focus-visible:ring-2 
        "
      >
        {label}
      </button>

      {open && (
        <div
          role="menu"
          className="
            absolute right-0 mt-2 w-44 z-50
            rounded-md border border-gray-200 dark:border-blue-500/30
            bg-white dark:bg-blue-900/90 backdrop-blur-md
            shadow-lg
          "
        >
          <button
            onClick={() => navigate("/login")}
            className="
              flex w-full items-center gap-2
              px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400
              hover:bg-green-100 dark:hover:bg-green-900/60 hover:text-green-700 dark:hover:text-green-300
            "
          >
            <LogIn size={16} />
            Login
          </button>

          <button
            onClick={handleLogout}
            className="
              flex w-full items-center gap-2
              px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400
              hover:bg-red-100 dark:hover:bg-red-900/60 hover:text-red-700 dark:hover:text-red-300
            "
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
