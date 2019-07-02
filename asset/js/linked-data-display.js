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

                // The data markup container.
                const container = document.createElement('div');
                container.className = 'linked-data-display';

                // The toggle button.
                const toggleButton = document.createElement('button');
                toggleButton.className = 'linked-data-display-more-less';
                toggleButton.innerHTML = '-';
                toggleButton.style.display = 'none';
                toggleButton.onclick = function() {
                    if ('none' === container.style.display) {
                        container.style.display = 'block';
                        this.innerHTML = '-';
                    } else {
                        container.style.display = 'none';
                        this.innerHTML = '+';
                    }
                };

                // The fetch button.
                const fetchButton = document.createElement('button');
                fetchButton.className = 'linked-data-display-fetch';
                fetchButton.innerHTML = '+';
                fetchButton.onclick = function() {
                    LinkedDataDisplay.display(service, uriValue.href, container);
                    toggleButton.style.display = 'inline';
                    this.remove();
                };

                uriValue.parentNode.appendChild(fetchButton);
                uriValue.parentNode.appendChild(toggleButton);
                uriValue.parentNode.appendChild(container);

                return false;
            }
        });
    }
});
