'use strict'

const LinkedDataDisplay = {
    services : [],
    /**
     * Add linked data service.
     *
     * Every service should implement the following functions:
     *   - getName() {string}: Get the name of this service
     *   - isMatch(url) {bool}: Is the URL a match for this service?
     *   - getEndpoint(url) {string}: Get the linked data endpoint for the URL
     *   - getMarkup(url, text) {string}: Get the markup derived from the data
     *
     * @param {object} service A linked data service object
     */
    addService: function(service) {
        this.services.push(service);
    },
    /**
     * Display linked data.
     *
     * @param {object} service The linked data service object
     * @param {string} uri The URI
     * @param {object} container The container element
     */
    display: function(service, uri, container) {
        return fetch(service.getEndpoint(uri))
            .then(function(response) {
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return response.text();
            })
            .then(function(text) {
                container.innerHTML = service.getMarkup(uri, text);
            })
            .catch(function(error) {
                console.log(`Error in service "${service.getName()}" using URI "${uri}": ${error.message}`);
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
