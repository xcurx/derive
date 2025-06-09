import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
// import { Provider } from "react-redux";
// import store from "@/store/store";
import { Providers } from "./providers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/wagmi.config";
import { headers } from "next/headers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie") ?? ""
  );

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialState={initialState}>
          {/* <Provider store={store}> */}
            <Header/>
            {children} 
            <Toaster/>
          {/* </Provider> */}
        </Providers>
      </body>
    </html>
  );
}
