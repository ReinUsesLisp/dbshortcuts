fetch(chrome.runtime.getURL('config.json'))
    .then((response) => response.text())
    .then(function(config) {
        var script = document.createElement('script');
        script.src = chrome.runtime.getURL('dbshortcuts.js');
        script.onload = function() {
            document.dispatchEvent(new CustomEvent('DBSConfigLoaded', {
                detail: config,
                bubbles: true,
                cancelable: true
            }));
            this.remove();
        };
        (document.head || document.documentElement).appendChild(script);
    });
