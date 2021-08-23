# obsidian-hot-reload-mobile
Hot Reload for Obsidian Mobile App

**NOTE: this currently requires a change to the Desktop Hot Reload plugin to function properly. Until this change is adopted by that plugin, see the Adjusting Hot Reload Desktop section for a manual fix.**

This plugin will watch for changes to plugins on mobile and reload them.

## Dependencies
1. Hot Reload on Desktop must be installed and enabled in your development vault.
2. Your development vault must be open so Hot Reload is triggered
3. A note in your development vault titles `hot-reload`
4. Development is done on the Desktop, either directly, or using ssh/code-server

## Install
Download the release and put the files in your `plugins` folder as usual

## How it works
1. You make a change to a plugin and trigger the Desktop version of Hot Reload
2. Hot Reload on Desktop writes the plugin that was updated to the `hot-reload` note in your vault
3. Hot Reload on Mobile watches for changes to the `hot-reload` note. When it sees a change it reloads the plugin on mobile

## Adjusting Hot Reload Desktop

Add the following code to the `reload()` method in `main.js` of Hot Reload at the bottom of a `try` block

```js
const tFile = this.app.vault.getAbstractFileByPath('hot-reload.md')
const content = await this.app.vault.read(tFile)
await this.app.vault.modify(tFile, plugin.concat("\n", content))
```