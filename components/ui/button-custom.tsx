import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const buttonCustom = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-xl",
    "text-center",
    "border",
    "transition-colors",
    "delay-50",
  ],
  {
    variants: {
      intent: {
        solid: ["bg-[#14B8A6]", "text-white", "border-[#14B8A6]", "hover:enabled:bg-[#0E9384]"],
        outline: ["bg-transparent", "text-[#14B8A6]", "border-[#14B8A6]", "hover:enabled:bg-[#14B8A6]/10"],
      },
      size: {
        sm: ["min-w-20", "h-full", "min-h-8", "text-xs", "py-1.5", "px-3"],
        md: ["min-w-24", "h-full", "min-h-10", "text-sm", "py-2", "px-4"],
        lg: ["min-w-32", "h-full", "min-h-12", "text-base", "py-2.5", "px-6"],
      },
    },
    defaultVariants: {
      intent: "solid",
      size: "md",
    },
  }
)

export interface ButtonCustomProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonCustom> {
  text: string
  icon?: React.ReactNode
}

export function ButtonCustom({ className, intent, size, text, icon, ...props }: ButtonCustomProps) {
  return (
    <button className={twMerge(buttonCustom({ intent, size, className }))} {...props}>
      {icon && <span className="w-4 h-4 mr-1.5">{icon}</span>}
      {text}
    </button>
  )
}
