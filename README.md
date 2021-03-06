# obsidian-hot-reload-mobile
Hot Reload for Obsidian Mobile App


This plugin will watch for changes to plugins on mobile and reload them.

## Dependencies
1. This plugin needs to be installed and enabled on desktop and mobile vaults.
2. Your development vault must be open so Hot Reload is triggered
3. A note in your development vault titles `hot-reload`
4. Development is done on the Desktop, either directly, or using ssh/code-server
5. You are using Obsidian Sync or some way to sync notes between devices

## Install
Download the release and put the files in your `plugins` folder as usual

## How it works
1. You make a change to a plugin and trigger the plugin on desktop
2. On Desktop this plugin writes the id of the plugin that was updated to the `hot-reload` note in your vault
3. On Mobile it watches for changes to the `hot-reload` note. When it sees a change it reloads the plugin on mobile
