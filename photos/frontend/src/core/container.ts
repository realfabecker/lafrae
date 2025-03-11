import { Container as InversifyContainer, interfaces } from "inversify";
import { Types } from "@core/ports/ports.ts";

import { LocalAuthService } from "@core/adapters/LocalAuthService.ts";
import { PicsumPhotoService } from "@core/adapters/PicsumPhotoService.ts";
import { ProviderEnum, StateKEnum } from "@core/domain/domain.ts";
import { SintesePhotoService } from "@core/adapters/SintesePhotoService.ts";
import { SinteseAuthService } from "@core/adapters/SinteseAuthService.ts";
import { LocalPhotoService } from "@core/adapters/LocalPhotoService.ts";

const m = location.search.match(/\?provider=(?<provider>.*)&?/);
if (m?.groups?.["provider"]) {
  localStorage.setItem(StateKEnum.Provider, m?.groups?.["provider"]);
}

export const container = new InversifyContainer();
container
  .bind(Types.PhotoService)
  .toDynamicValue((context: interfaces.Context) => {
    const provider =
      localStorage.getItem(StateKEnum.Provider) || ProviderEnum.Picsum;
    if (provider === ProviderEnum.Lambda) {
      return new SintesePhotoService(context.container.get(Types.AuthService));
    }
    if (provider === ProviderEnum.Local) {
      return new LocalPhotoService();
    }
    return new PicsumPhotoService();
  });

container.bind(Types.AuthService).toDynamicValue(() => {
  const provider =
    localStorage.getItem(StateKEnum.Provider) || ProviderEnum.Picsum;
  if (provider === ProviderEnum.Lambda) {
    return new SinteseAuthService();
  }
  return new LocalAuthService();
});
