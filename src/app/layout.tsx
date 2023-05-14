import './globals.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  display: 'swap',
  subsets: ['latin-ext'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata = {
  title: 'Cafeteria App',
  description: 'Cafeteria App for small business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
