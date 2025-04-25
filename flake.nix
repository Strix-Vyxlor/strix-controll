{
  description = "decky dev flake";
  outputs = inputs @ {...}:
    inputs.flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import inputs.nixpkgs {
          inherit system;
        };
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            pnpm_9
            nodejs_22
            python312
            zip
          ];
        };
        packages.default = pkgs.stdenvNoCC.mkDerivation {
          name = "strix-controll";
          src = ./.;

          nativeBuildInputs = with pkgs; [
            pnpm_9
            nodejs_22
            python312
            zip
          ];

          installPhase = ''
            mkdir -p $out/strix-controll/dist
            cp $src/dist/index.js $out/strix-controll/dist
            cp package.json plugin.json main.py README.md LICENSE $out/strix-controll

            cd $out
            zip $out/strix-controll.zip strix-controll/**/* strix-controll/*
          '';
        };
      }
    );
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
}
