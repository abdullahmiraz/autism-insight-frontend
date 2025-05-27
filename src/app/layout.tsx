import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import "./globals.css";
import QueryClientWrapper from "./QueryClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-gray-100 text-gray-900`}>
        <QueryClientWrapper>
          <>
            <Navbar />
            <main className="  mx-auto  min-h-screen">
              {children}
            </main>
            <Footer />
          </>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
