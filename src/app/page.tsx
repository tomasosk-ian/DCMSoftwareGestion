import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import HomePage from "./_components/home_page";
import Header from "./_components/header";
import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
export default async function Home() {
  const cities = await api.city.get.query();
  const sizes = await api.size.get.query();
  return (
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <meta name="theme-color" content="#5b9a8b" />
        <title>
          Lockers Urbanos | Guarda equipajes en Bariloche – Una solución
          inteligente para el guardado de equipaje
        </title>
        <meta name="robots" content="max-image-preview:large" />

        <meta
          property="og:site_name"
          content="Lockers Urbanos | Guarda equipajes en Bariloche"
        />
        <meta property="og:title" content="Home" />
        <meta property="og:url" content="https://lockersurbanos.com.ar/" />
        <meta property="og:type" content="website" />
        <link rel="profile" href="https://gmpg.org/xfn/11" />

        <link
          rel="stylesheet"
          id="dt-main-css"
          href="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/1702657728-css7e6af7f20afc90f9937b2e12d7806a28286816faf8286b6bbb827658eacf3.css"
          type="text/css"
          media="all"
        />

        <link
          rel="stylesheet"
          id="dt-custom-css"
          href="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/1702657728-css488a286eaed46c6232365922be0922a980c748b20b862b95c3c064a2c663e.css"
          type="text/css"
          media="all"
        />
      </head>
      <body className={`font-sans ${inter.variable}`}>
        <main>
          <div>
            <Header />
            <HomePage cities={cities} sizes={sizes} />
          </div>
        </main>
      </body>
    </html>
  );
}
