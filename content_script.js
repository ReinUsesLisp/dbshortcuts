fetch(chrome.runtime.getURL('config.json'))
    .then((response) => response.json())
    .then(function(config) {
        var script = document.createElement('script');
        script.src = chrome.runtime.getURL('dbshortcuts.js');
        script.onload = function() {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('DBSConfigLoaded', true, true, config);
            document.dispatchEvent(event);

            this.remove();
        };
        (document.head || document.documentElement).appendChild(script);
    });
