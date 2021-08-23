const {Plugin, Notice, Events} = require("obsidian");


module.exports = class MobileHotReload extends Plugin {
    PluginChange = new Events();
    PluginChangeRef;
    modifyRef;

    onload() { 
       this.PluginChangeRef = this.PluginChange.on('plugin-updated', async () => {
            const tFile = this.app.vault.getAbstractFileByPath('hot-reload.md')
            const logContent = await this.app.vault.read(tFile)
            const plugin = logContent.split('\n')[0]
            const plugins = this.app.plugins
            await plugins.disablePlugin(plugin);
            console.debug("mobile-disabled", plugin);
            await plugins.enablePlugin(plugin);
            console.debug("mobile-enabled", plugin);
            new Notice(`Mobile Plugin "${plugin}" has been reloaded`);
        })

        this.modifyRef = this.app.vault.on('modify', (file) => {
            if (file.name === 'hot-reload.md') {
                console.debug('mobile-hotrelad: trigging update')
                this.PluginChange.trigger('plugin-updated')
            }
        })

     }
     onunload() {
        this.PluginChange.offref(this.PluginChangeRef)
        this.app.vault.offref(this.modifyRef)
     }

}