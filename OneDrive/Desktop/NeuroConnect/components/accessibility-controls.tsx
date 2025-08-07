"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, Sun, Moon, Type, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { useAccessibility } from "@/components/accessibility-provider"

export function AccessibilityControls() {
  const { theme, setTheme } = useTheme()
  const { fontSize, setFontSize, language, setLanguage } = useAccessibility()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Accessibility settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center">
          <Type className="mr-2 h-4 w-4" />
          Font Size
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={() => setFontSize("small")}>
          <span className={fontSize === "small" ? "font-bold" : ""}>Small</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize("medium")}>
          <span className={fontSize === "medium" ? "font-bold" : ""}>Medium</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize("large")}>
          <span className={fontSize === "large" ? "font-bold" : ""}>Large</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center">
          <Globe className="mr-2 h-4 w-4" />
          Language
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span className={language === "en" ? "font-bold" : ""}>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("hi")}>
          <span className={language === "hi" ? "font-bold" : ""}>हिंदी</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
