export default async function Home() {
  return (
    <div>
      <div
        className="flex flex-row inline-header center widgets full-height large-mobile-menu-icon dt-parent-menu-clickable show-sub-menu-on-hover show-device-logo show-mobile-logo top-0 bg-[#0F0C24]"
        role="banner"
      >
        <header className="flex flex-row header-bar bg-[#0F0C24] w-full">
          <div className="branding">
            <div id="site-title" className="assistive-text">
              Iguazú Lockers
            </div>
            <div id="site-description" className="assistive-text">
              Una solución inteligente para el guardado de equipaje
            </div>
          </div>
          <ul id="primary-menu" className="flex flex-row main-nav outside-item-remove-margin">
            <li>
              <a className="" href="https://iguazulockers.com/">
                <img
                  src="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/logo-iguazu.png"
                  width="207"
                  height="74"
                  sizes="207px"
                  alt="Iguazú Lockers"
                />
              </a>
            </li>
            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-11 current_page_item menu-item-27 first depth-0">
              <a href="https://iguazulockers.com/" data-level="1">
                <span className="menu-item-text">
                  <span className="text-[#00E1A5]">Home</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-30 depth-0">
              <a href="https://iguazulockers.com/#!/lockers" data-level="1">
                <span className="menu-item-text">
                  <span className="text-[#00E1A5]">Lockers</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-29 depth-0">
              <a
                href="https://iguazulockers.com/preguntas-frecuentes/"
                data-level="1"
              >
                <span className="menu-item-text">
                  <span className="text-[#00E1A5]">Preguntas Frecuentes</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-28 last depth-0">
              <a href="https://iguazulockers.com/contacto/" data-level="1">
                <span className="menu-item-text">
                  <span className="text-[#00E1A5]">Contacto</span>
                </span>
              </a>
            </li>
          </ul>
          <div className="mini-widgets">
            <div className="soc-ico show-on-desktop in-top-bar-right in-menu-second-switch disabled-bg custom-border border-on hover-disabled-bg hover-custom-border hover-border-on first last">
              <a
                title="Instagram page opens in new window"
                href="https://iguazulockers.com/#"
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
                href="https://iguazulockers.com/#"
                target="_blank"
                className="facebook"
              >
                <span className="soc-font-icon"></span>
                <span className="screen-reader-text">
                  Facebook page opens in new window
                </span>
              </a>
            </div>
          </div>
        </header>
        <div className="mobile-header-bar bg-[#0F0C24]">
          <div className="mobile-navigation">
            <a
              href="https://iguazulockers.com/#"
              className="dt-mobile-menu-icon"
              aria-label="Mobile menu icon"
            >
              <div className="lines-button">
                <span className="menu-line"></span>
                <span className="menu-line"></span>
                <span className="menu-line"></span>
              </div>
            </a>
          </div>
          <div className="mobile-mini-widgets"></div>
          <div className="mobile-branding">
            <a className="" href="https://iguazulockers.com/">
              <img
                className="preload-me"
                src="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/logo-lockers.png"
                width="207"
                height="74"
                sizes="207px"
                alt="Iguazú Lockers"
              />
              <img
                className="mobile-logo preload-me"
                src="./Lockers Urbanos _ Guarda equipajes en Bariloche – Una solución inteligente para el guardado de equipaje_files/logo_m.png"
                width="183"
                height="64"
                sizes="183px"
                alt="Iguazú Lockers"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
