import { Outlet } from "react-router";
import Header from "@pages/Layout/Header.tsx";
import Footer from "@pages/Layout/Footer.tsx";
import { useInjection } from "inversify-react";
import { IAuthService, Types } from "@core/ports/ports.ts";
import { ProviderEnum, RoutesEnum, StateKEnum } from "@core/domain/domain.ts";
import { Navigate } from "react-router-dom";

export const PubLayout = () => {
  return (
    <div id="app">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const PrivLayout = () => {
  const service = useInjection<IAuthService>(Types.AuthService);
  const provider = localStorage.getItem(StateKEnum.Provider);
  if (!service.isLoggedIn() && provider === ProviderEnum.Lambda) {
    const url = service.getAuthUrl(location.origin + "/oauth/", provider);
    window.location.href = url;
    return <></>;
  } else if (!service.isLoggedIn()) {
    return <Navigate to={RoutesEnum.Login + location.search} />;
  }
  return (
    <div id="app">
      <Header />
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
