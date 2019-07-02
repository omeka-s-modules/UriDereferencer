'use strict'

const LinkedDataDisplay = {
    services : [],
    addService: function(service) {
        this.services.push(service);
    },
    display: function(service, uri, container) {
        return fetch(service.getEndpoint(uri))
            .then(function(response) {
                if (!response.ok) {
                    throw new Error(`HTTP Status ${response.status}`);
                }
                return response.text();
            })
            .then(function(text) {
                container.innerHTML = service.getMarkup(uri, text);
            })
            .catch(function(error) {
                console.log(`Cannot fetch endpoint for service "${service.name}": ${error.message}`);
            });
    }
};

document.addEventListener('DOMContentLoaded', function(event) {
    for (let uriValue of document.getElementsByClassName('uri-value-link')) {
        LinkedDataDisplay.services.forEach(function(service) {
            if (service.isMatch(uriValue.href)) {
                // The fetch button.
                const button = document.createElement('button');
                button.className = 'linked-data-display-button';
                button.innerHTML = 'more';
                button.onclick = function() {
                    LinkedDataDisplay.display(service, uriValue.href, container);
                    this.remove();
                };

                // The data markup container.
                const container = document.createElement('div');
                container.className = 'linked-data-display';

                uriValue.parentNode.appendChild(button);
                uriValue.parentNode.appendChild(container);

                return false;
            }
        });
    }
});
