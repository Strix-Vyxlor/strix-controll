import { createContext, useContext, PropsWithChildren, useEffect, useState, FC } from "react"
import { BrightnessDevice, getBrightnessDevices } from "./brightnessHelper";

export interface AppStateContext {
  page: string,
  brightnessDevices: BrightnessDevice[],

  updateBrightnessDevices(): Promise<void>,
};

export class AppState {
  private _page = "home";
  private _brightnessDevices: BrightnessDevice[] = [];

  get page(): string {
    return this._page;
  }

  get brightnessDevices(): BrightnessDevice[] {
    return this._brightnessDevices;
  }

  async updateBrightnessDevices() {
    this._brightnessDevices = await getBrightnessDevices();
  }

  get state(): AppStateContext {
    return {
      page: this.page,
      brightnessDevices: this.brightnessDevices,
      updateBrightnessDevices: () => this.updateBrightnessDevices(),
    };
  }
}

export const AppStateContext = createContext<AppStateContext>(null as any);

export const useAppState = () => useContext(AppStateContext);


interface Props extends PropsWithChildren {
  appState: AppState;
}

export const AppStateContextProvider: FC<Props> = ({ children, appState }) => {
  const [publicAppState, setPublicAppState] = useState<AppStateContext>({ ...appState.state });

  useEffect(() => {
    function onUpdate() {
      setPublicAppState({ ...appState.state });
    }

  }, []);


  return (
    <AppStateContext.Provider
      value={{ ...publicAppState }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
