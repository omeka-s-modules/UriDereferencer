'use strict'

const LinkedDataDisplay = {
    services: new Map(),
    /**
     * Add a linked data service object.
     *
     * Note that services are keyed by their name. If services have duplicate
     * names, the last service added will overwrite the previous.
     *
     * Every service object should implement the following functions:
     *   - getName() {string}: Get the name of this service
     *   - isMatch(uri) {bool}: Is the URI a match for this service?
     *   - getEndpoint(uri) {string}: Get the linked data endpoint for the URI
     *   - getMarkup(uri, text) {string}: Get the markup derived from the data
     *
     * @param {object} service A linked data service object
     */
    addService: function(service) {
        this.services.set(service.getName(), service);
    },
    /**
     * Get a service object by URI.
     *
     * @param {string} uri The URI
     * @return {object|false} Returns false if no service matches
     */
    getServiceByUri: function(uri) {
        for (let service of this.services.values()) {
            if (service.isMatch(uri)) {
                return service;
            }
        }
        return false;
    },
    /**
     * Display linked data.
     *
     * @param {string} uri The URI
     * @param {object} container The container element
     */
    display: function(uri, container) {
        const service = this.getServiceByUri(uri);
        if (service) {
            fetch(service.getEndpoint(uri))
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
    },
    /**
     * Check to see if a value is set.
     *
     * A utility function helpful for checking deep values in a JSON object.
     *
     * @param {function} accessor Function that returns the value
     */
    isset: function(accessor) {
        try {
            return 'undefined' !== typeof accessor();
        } catch (e) {
            return false;
        }
    }
};

document.addEventListener('DOMContentLoaded', function(event) {
    for (let uriValue of document.getElementsByClassName('uri-value-link')) {
        if (LinkedDataDisplay.getServiceByUri(uriValue.href)) {
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
                LinkedDataDisplay.display(uriValue.href, container);
                toggleButton.style.display = 'inline';
                this.remove();
            };

            uriValue.parentNode.appendChild(fetchButton);
            uriValue.parentNode.appendChild(toggleButton);
            uriValue.parentNode.appendChild(container);
        }
    }
});
