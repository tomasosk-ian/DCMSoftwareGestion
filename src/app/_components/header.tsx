export default async function Home() {
  return (
    <div>
      <div
        className="masthead inline-header center widgets full-height large-mobile-menu-icon dt-parent-menu-clickable show-sub-menu-on-hover show-device-logo show-mobile-logo top-0"
        role="banner"
      >
        <div className="top-bar top-bar-empty top-bar-line-hide">
          <div className="top-bar-bg"></div>
          <div className="mini-widgets left-widgets"></div>
          <div className="mini-widgets right-widgets">
            <div className="soc-ico in-top-bar-right in-menu-second-switch disabled-bg custom-border border-on hover-disabled-bg hover-custom-border hover-border-on hide-on-desktop show-on-first-switch display-none">
              <a
                title="Instagram page opens in new window"
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
          </div>
        </div>
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
                  <span className="menu-text">Home</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-30 depth-0">
              <a href="https://lockersurbanos.com.ar/#!/lockers" data-level="1">
                <span className="menu-item-text">
                  <span className="menu-text">Lockers</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-29 depth-0">
              <a
                href="https://lockersurbanos.com.ar/preguntas-frecuentes/"
                data-level="1"
              >
                <span className="menu-item-text">
                  <span className="menu-text">Preguntas Frecuentes</span>
                </span>
              </a>
            </li>
            <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-28 last depth-0">
              <a href="https://lockersurbanos.com.ar/contacto/" data-level="1">
                <span className="menu-item-text">
                  <span className="menu-text">Contacto</span>
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
          </div>
        </header>
        <div className="mobile-header-bar">
          <div className="mobile-navigation">
            <a
              href="https://lockersurbanos.com.ar/#"
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
