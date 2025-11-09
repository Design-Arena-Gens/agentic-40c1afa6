export const metadata = {
  title: 'Polish Independence Day - November 11',
  description: 'A cinematic tribute to Poland\'s Independence Day',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
