import { useInjection } from "inversify-react";
import { IAuthService, Types } from "@core/ports/ports.ts";
import { useAppDispatch } from "@store/store.ts";
import { getActionPhotoModalSet } from "@store/photos/creators/photo.ts";
import { ModalState } from "@core/domain/domain.ts";

const Nav = (opts: { isLoggedIn: boolean }) => {
  const dispatch = useAppDispatch();
  return (
    <nav>
      {(opts.isLoggedIn && (
        <img
          src="/images/logo.svg"
          alt="Logotipo de câmera"
          className="logo upload"
          onClick={() => {
            dispatch(getActionPhotoModalSet(ModalState.Open));
          }}
        />
      )) || (
        <img src="/images/logo.svg" alt="Logotipo de câmera" className="logo" />
      )}

      {opts.isLoggedIn && (
        <ul>
          <li className="active">Galeria</li>
        </ul>
      )}
    </nav>
  );
};

const Avatar = ({ picture }: { picture?: string }) => {
  return (
    <img
      src={picture || "https://rafaelbecker.dev/profile.jpg"}
      alt="avatar image"
      className="avatar"
    />
  );
};

export default function Header() {
  const service = useInjection<IAuthService>(Types.AuthService);
  const isLoggedIn = service.isLoggedIn();
  const idToken = service.getIdToken();
  return (
    <header className={`container ${isLoggedIn ? "private" : "public"}`}>
      <Nav isLoggedIn={isLoggedIn} />
      {service.isLoggedIn() && <Avatar picture={idToken.picture} />}
    </header>
  );
}
