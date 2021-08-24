const {Plugin, Notice, Events} = require("obsidian");


module.exports = class MobileHotReload extends Plugin {
    PluginChange = new Events();
    PluginChangeRef;
    modifyRef;

    onload() { 
        if (this.app.isMobile) {

        
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
    } else {
        console.log('not on mobile')
        this.register(around(this.app.plugins, {enablePlugin(old) { return async function(pluginId) {
            console.log('mobile-hotreload writing')
            const result = await old.call(this, pluginId);
            console.log(pluginId)
            const tFile = this.app.vault.getAbstractFileByPath('hot-reload.md')
            if (tFile) {
            const content = await this.app.vault.read(tFile)
            await this.app.vault.modify(tFile, pluginId.concat("\n", content))
            }
            return result;
        }}}));
    }
     }
     onunload() {
         if (this.app.isMobile) {
        this.PluginChange.offref(this.PluginChangeRef)
        this.app.vault.offref(this.modifyRef)
         }
     }

}

function around(obj, factories) {
    const removers = Object.keys(factories).map(key => around1(obj, key, factories[key]));
    return removers.length === 1 ? removers[0] : function () { removers.forEach(r => r()); };
}

function around1(obj, method, createWrapper) {
    const original = obj[method], hadOwn = obj.hasOwnProperty(method);
    let current = createWrapper(original);
    // Let our wrapper inherit static props from the wrapping method,
    // and the wrapping method, props from the original method
    if (original)
        Object.setPrototypeOf(current, original);
    Object.setPrototypeOf(wrapper, current);
    obj[method] = wrapper;
    // Return a callback to allow safe removal
    return remove;
    function wrapper(...args) {
        // If we have been deactivated and are no longer wrapped, remove ourselves
        if (current === original && obj[method] === wrapper)
            remove();
        return current.apply(this, args);
    }
    function remove() {
        // If no other patches, just do a direct removal
        if (obj[method] === wrapper) {
            if (hadOwn)
                obj[method] = original;
            else
                delete obj[method];
        }
        if (current === original)
            return;
        // Else pass future calls through, and remove wrapper from the prototype chain
        current = original;
        Object.setPrototypeOf(wrapper, original || Function);
    }
}