# AntiName
TSL-AntiName is a TSL extension for validating character names. If a character does not pass the validation check, the player is booted.

## How to install
### Manually
Grab the latest release zip. The zip itself contains a folder called `antiname`. Simply extract the zip in the following path of a TSL installation:
`build/node_modules/terrariaserver-lite/extensions/`
This should result in the following path:
`build/node_modules/terrariaserver-lite/extensions/antiname`

When you launch the server, it should say this:
```
[Extension] AntiName v1.0 loaded.
```

## Via plugin manager
In the TSL root directory use `npm run pluginmanager install AntiName popstarfreas/TSL-AntiName master`

## How to build (for development)
You will need:
 * Node.js version 12 or greater (latest LTS is recommended)
 * `npm` which should come with Node.js

Clone the repository and at the root of the respository folder use: `npm install` to install the needed packages. Then use `npm run build` to produce a build in the folder `build/`. To convert this into a release, you just rename `build/` to `antiname/`. That folder is the same as what it used in the release zip.
