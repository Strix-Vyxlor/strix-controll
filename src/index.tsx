import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
  Dropdown,
  DropdownOption,
} from "@decky/ui";
import {
  addEventListener,
  removeEventListener,
  callable,
  definePlugin,
  toaster,
  // routerHook
} from "@decky/api"

import { FaLaptop } from "react-icons/fa";
import { AppState, AppStateContextProvider, useAppState } from "./Utils/appState"

// import logo from "../assets/logo.png";

const logger = callable<[logLevel: string, msg: string], void>("logger");

function Content() {
  const { brightnessDevices, updateBrightnessDevices, page } = useAppState();

  updateBrightnessDevices();

  return (
    <PanelSection title={"Panel Section: " + page} >
      <PanelSectionRow>
        <ul>
          {brightnessDevices.map((dev) => <li>{dev.name}</li>)}
        </ul>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => updateBrightnessDevices()}
        >
          {"Get light devices"}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection >
  );
};

export default definePlugin(() => {
  const state = new AppState();

  return {
    // The name shown in various decky menus
    name: "Strix controll",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>Strix controll</div>,
    // The content of your plugin's menu
    content: <AppStateContextProvider appState={state}>
      <Content />
    </AppStateContextProvider>,
    // The icon displayed in the plugin list
    icon: <FaLaptop />,
    // The function triggered when your plugin unloads
    onDismount() { },
  };
});
