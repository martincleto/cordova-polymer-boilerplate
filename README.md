# cordova-polymer-boilerplate
A Cordova framework boilerplate for shipping mobile apps based on Polymer.

Development environment details:
- Windows 10 version 1803 build 17134
- Node.js 8.11.3
- NPM 6.4.1
- Cordova 8.0.0
- Polymer CLI 1.8.0

This boilerplate has been tested in the development environment described above for browser and android platforms.

Feel free to [open an issue](https://github.com/martincleto/cordova-polymer-boilerplate/issues/new) for bugs and troubleshooting when used in other environments and/or to ship to other target platforms.

## Requirements
You need [Node.js](https://nodejs.org), [Cordova](https://cordova.apache.org/) and [Polymer CLI](https://github.com/Polymer/tools/tree/master/packages/cli) installed in your system.

### Note for Windows users

If you develop in a Windows enviroment, using a bash shell for Windows is recommended.

You may check out the following articles if you don't have bash already available in your system:

- [Windows Subsystem for Linux Documentation](https://docs.microsoft.com/es-es/windows/wsl/about)
- [How to Install and Use the Linux Bash Shell on Windows 10](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/)

## Steps

### 1. Clone this repo
`$ git clone https://github.com/martincleto/cordova-polymer-boilerplate`

### 2. Add your application target platforms
`$ cd cordova-polymer-boilerplate`

And then add the target platforms for your app by using [Cordova CLI](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html), e.g.:

`$ cordova platform add browser`

`$ cordova platform add android`

See "Develop for platforms" entry on [Cordova docs](https://cordova.apache.org/docs/en/latest/guide/overview/index.html) in order to accomplish your system requirements for the platforms you want to target.

### 3. Set your Polymer App name and path
Edit [app.config.js](https://github.com/martincleto/cordova-polymer-boilerplate/app.config.js) file (in the project root) and set the name of your Polymer app and the path where is located in your local, e.g.:

```
module.exports = {
    polymerAppName: 'MyPolymerApp',
    polymerAppPath: 'path/to/my/polymer/app'
}
```
### 4. Link the Cordova project to your Polymer App
If there is a `www` folder into the Cordova project root folder, just remove it.

`$ rm -rf www`

Create a symbolic link targeting your Polymer App **build path**, e.g.

`$ ln -s path/to/my/polymer/app www`

### 5. Build the project

`$ cordova build <platform>`

For creating all your target platforms builds at once, just run:

`$ cordova build`

See Cordova [build](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-build-command) command reference.

### 6. Deploy the app

`$ cordova run <platform>`

## How it works
This boilerplate uses a "before_build" hook to launch a [script](hooks/appBeforeBuild.js) which runs your Polymer App build to be subsequently handled by Cordova.

Learn more about [Cordova hooks](https://cordova.apache.org/docs/en/latest/guide/appdev/hooks/index.html).


## Notes about Polymer
### Build configuration
Following Polymer build configuration (in your Polymer App **polymer.json** file) is recommended, specially for shipping to Android:

```
"builds": [
    {
      "name": "cordova",
      "preset": "es6-bundled",
      "addServiceWorker": false
    }
```

### Content Security Policy
Following [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) rules should be added to your Polymer App **index.html** file:

`<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">`

