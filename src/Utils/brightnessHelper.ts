import { callable } from "@decky/api"
import { useState } from "react";

interface BrightnessDeviceInterface {
  name: string;
  type: string;
  value: number;
  percent: number;
  max: number;
}

interface SetBrightnessRet {
  value: number;
  percent: number;
}

const getDevices = callable<[], BrightnessDeviceInterface[]>("get_brightness_devices");
const setBrightness = callable<[device: string, value: number], SetBrightnessRet>("set_brightness");
const logger = callable<[logLevel: string, msg: string], void>("logger");

enum BrightnessDeviceType {
  Backlight,
  Leds,
  Unknown,
}

export class BrightnessDevice {
  private readonly _name: string;
  private readonly _type: BrightnessDeviceType;
  private _value: number;
  private _percent: number;
  private readonly _max: number;

  constructor(name: string, type: BrightnessDeviceType, value: number, percent: number, max: number) {
    this._name = name;
    this._type = type;
    this._value = value;
    this._percent = percent;
    this._max = max;
  }

  get name(): string {
    return this._name;
  }

  get type(): BrightnessDeviceType {
    return this._type;
  }

  get value(): number {
    return this._value
  }

  set value(newValue: number) {
    this.setValue(newValue);
  }

  get percent(): number {
    return this._percent
  }

  get max(): number {
    return this._max
  }

  private async setValue(newValue: number) {
    const ret = await setBrightness(this.name, newValue);
    this._value = ret.value;
    this._percent = ret.percent;
  }
}

export async function getBrightnessDevices(): Promise<BrightnessDevice[]> {
  const ifaces = await getDevices();
  const devs = ifaces.map((iface: BrightnessDeviceInterface) => {
    let type = BrightnessDeviceType.Unknown;
    switch (iface.type) {
      case "backlight":
        type = BrightnessDeviceType.Backlight;
        break;
      case "leds":
        type = BrightnessDeviceType.Leds;
        break;
    }
    return new BrightnessDevice(iface.name, type, iface.value, iface.percent, iface.max);
  });

  return devs;
}
