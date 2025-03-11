import { useLocation } from "react-router";
import { useInjection } from "inversify-react";
import { IAuthService, Types } from "@core/ports/ports.ts";
import { Navigate } from "react-router-dom";
import { ProviderEnum, RoutesEnum, StateKEnum } from "@core/domain/domain.ts";

export default function Oauth() {
  const location = useLocation();
  const service = useInjection<IAuthService>(Types.AuthService);
  if (service.isLoggedIn()) {
    return <Navigate to={RoutesEnum.Photos + location.search} />;
  }
  if (/^#access_token/.test(location.hash)) {
    const params = new URLSearchParams(location.hash.substring(1));
    const states = params.get("state") || ProviderEnum.Picsum;
    service.loginToken(
      params.get("access_token") as string,
      params.get("id_token") as string
    );
    localStorage.setItem(StateKEnum.Provider, states);
    return <Navigate to={RoutesEnum.Photos + "?provider=" + states} />;
  }
  return <Navigate to={RoutesEnum.Login + location.search} />;
}
