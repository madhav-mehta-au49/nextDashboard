import "styles/tailwind.css"
import { Provider } from "@/components/ui/provider"
import Providers from "./providers"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider><Providers>{children}</Providers></Provider>
      </body>
    </html>
  )
}