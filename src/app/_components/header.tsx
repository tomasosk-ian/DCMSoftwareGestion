"use client"
import ButtonCustomComponent from "~/components/buttonCustom";
import { setLang } from "../actions";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Languages } from "~/translations";
import { SidebarTrigger, useSidebar } from "~/components/ui/sidebar";

export default function Home({ lang }: { lang?: string }) {
  const t = useTranslations("HomePage");
  const { toggleSidebar } = useSidebar();

  return (
    <div>
      <div
        className="masthead inline-header center widgets large-mobile-menu-icon dt-parent-menu-clickable show-sub-menu-on-hover show-device-logo show-mobile-logo top-0"
        role="banner"
      >
        <header className="header-bar">
          <div className="branding">
            <div id="site-title" className="assistive-text">
              Lockers Urbanos | Guarda equipajes en Bariloche
            </div>
            <div id="site-description" className="assistive-text">
              Una solución inteligente para el guardado de equipaje
            </div>
            <a className="" href="https://lockersurbanos.com.ar/">
              <img
                className="preload-me"
                src="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/logo-lockers.png"
                width="207"
                height="74"
                sizes="207px"
                alt="Lockers Urbanos | Guarda equipajes en Bariloche"
              />
              <img
                className="mobile-logo preload-me"
                src="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/logo_m.png"
                width="183"
                height="64"
                sizes="183px"
                alt="Lockers Urbanos | Guarda equipajes en Bariloche"
              />
            </a>
          </div>
          <ul id="primary-menu" className="main-nav outside-item-remove-margin">
            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-11 current_page_item menu-item-27 first depth-0">
              <a href="https://lockersurbanos.com.ar/" data-level="1">
                <span className="menu-item-text">
                  <span className="menu-text">{t("home")}</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-30 depth-0">
              <a href="https://lockersurbanos.com.ar/#!/lockers" data-level="1">
                <span className="menu-item-text">
                  <span className="menu-text">{t("lockers")}</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-29 depth-0">
              <a
                href="https://lockersurbanos.com.ar/preguntas-frecuentes/"
                data-level="1"
              >
                <span className="menu-item-text">
                  <span className="menu-text">{t("faq")}</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-28 last depth-0">
              <a href="https://lockersurbanos.com.ar/contacto/" data-level="1">
                <span className="menu-item-text">
                  <span className="menu-text">{t("contact")}</span>
                </span>
              </a>
            </li>
          </ul>
          <div className="mini-widgets">
            <div className="soc-ico show-on-desktop in-top-bar-right in-menu-second-switch disabled-bg custom-border border-on hover-disabled-bg hover-custom-border hover-border-on first last">
              <a
                title="Instagram page opens in new window"
                href="https://lockersurbanos.com.ar/#"
                target="_blank"
                className="instagram"
              >
                <span className="soc-font-icon"></span>
                <span className="screen-reader-text">
                  Instagram page opens in new window
                </span>
              </a>
              <a
                title="Facebook page opens in new window"
                href="https://lockersurbanos.com.ar/#"
                target="_blank"
                className="facebook"
              >
                <span className="soc-font-icon"></span>
                <span className="screen-reader-text">
                  Facebook page opens in new window
                </span>
              </a>
            </div>
            <div className="max-w-[140px] pl-4">
              <Select
                defaultValue={lang}
                onValueChange={(v) => setLang(v as Languages).catch(console.error)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        <div className="mobile-header-bar">
          <div className="mobile-navigation">
            <button
              className="dt-mobile-menu-icon"
              aria-label="Mobile menu icon"
              onClick={() => toggleSidebar()}
            >
              <div className="lines-button">
                <span className="menu-line"></span>
                <span className="menu-line"></span>
                <span className="menu-line"></span>
              </div>
            </button>
          </div>
          <div className="mobile-mini-widgets"></div>
          <div className="mobile-branding">
            <a className="" href="https://lockersurbanos.com.ar/">
              <img
                className="preload-me"
                src="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/logo-lockers.png"
                width="207"
                height="74"
                sizes="207px"
                alt="Lockers Urbanos | Guarda equipajes en Bariloche"
              />
              <img
                className="mobile-logo preload-me"
                src="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/logo_m.png"
                width="183"
                height="64"
                sizes="183px"
                alt="Lockers Urbanos | Guarda equipajes en Bariloche"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
