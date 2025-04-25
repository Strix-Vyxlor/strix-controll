import os
import subprocess
import shutil

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code repo
# and add the `decky-loader/plugin/imports` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky
import asyncio


class Plugin:
    async def get_brightness_devices(self) :
        decky.logger.info("get_devices called")
         
        out = subprocess.check_output(["brightnessctl", "-lm"], text=True) 
        split = out.splitlines()
        
        devices= []
        for string in split:
            keys = string.split(",")
            devices.append({
                    "name": keys[0],
                    "type": keys[1],
                    "value": int(keys[2]),
                    "percent": int(keys[3][:-1]),
                    "max": int(keys[4])}) 
        return devices;

    async def set_brightness(self, device: str, value: int):
        decky.logger.info(f"setting brightness for {device} to {value}")
        subprocess.check_call(["brightnessctl", "-d", device, "set", str(value)])
        out = subprocess.check_output(["brightnessctl", "-md", device], text=True)
        keys = out.split(",")
        return {
            "value": int(keys[2]),
            "percent": int(keys[3][:-1])
            }

    async def logger(self, logLevel:str, msg:str):
        msg = '[frontend] {}'.format(msg)
        match logLevel.lower():
          case 'info':      decky.logger.info(msg)
          case 'debug':     decky.logger.debug(msg)
          case 'warning':   decky.logger.warning(msg)
          case 'error':     decky.logger.error(msg)
          case 'critical':  decky.logger.critical(msg)

