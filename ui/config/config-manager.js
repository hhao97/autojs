const defaultConfig = require('./default');

let instance = null;

function createConfigManager(storageKey) {
    if (instance) {
        return instance;
    }

    function ConfigManager(storageKey) {
        this.storage = storages.create('settings');
        this.storageKey = storageKey;
        this.config = this.load();
    }

    // 加载配置
    ConfigManager.prototype.load = function() {
        let config = this.storage.get(this.storageKey);
        if (!config) {
            config = defaultConfig;
            this.save(config);
        }
        return config;
    };

    // 保存配置
    ConfigManager.prototype.save = function(config) {
        this.storage.put(this.storageKey, config);
        this.config = config;
    };

    // 获取配置
    ConfigManager.prototype.get = function() {
        return this.config;
    };

    // 更新配置
    ConfigManager.prototype.update = function(newConfig) {
        // 使用传统的对象合并方式
        for (let key in newConfig) {
            if (newConfig.hasOwnProperty(key)) {
                this.config[key] = newConfig[key];
            }
        }
        this.save(this.config);
        return this.config;
    };

    // 重置配置
    ConfigManager.prototype.reset = function() {
        this.config = defaultConfig;
        this.save(this.config);
        return this.config;
    };

    instance = new ConfigManager(storageKey);
    return instance;
}

module.exports = createConfigManager; 