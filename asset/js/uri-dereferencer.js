'use strict'

/**
 * Use to dereference a URI using registered linked data services.
 */
const UriDereferencer = {
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
     *   - getResourceUrl(uri) {string}: Get the resource URL of a URI
     *   - getMarkup(uri, text) {string}: Get the markup derived from the resource
     *
     * @param {object} service A linked data service object
     */
    addService(service) {
        this.services.set(service.getName(), service);
    },
    /**
     * Get a service object by URI.
     *
     * @param {string} uri The URI
     * @return {object|false} Returns false if no service matches
     */
    getServiceByUri(uri) {
        for (let service of this.services.values()) {
            if (service.isMatch(uri)) {
                return service;
            }
        }
        return false;
    },
    /**
     * Dereference a URI and return the linked data markup.
     *
     * @param {string} uri The URI
     * @return {Promise} A promise to return markup
     */
    async dereference(uri) {
        const service = this.getServiceByUri(uri);
        if (service) {
            try {
                const response = await fetch(service.getResourceUrl(uri));
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return service.getMarkup(uri, await response.text());
            } catch (error) {
                console.log(`Error in service "${service.getName()}" using URI "${uri}": ${error.message}`);
            }
        }
    },
    /**
     * Check to see if a value is set.
     *
     * A utility function helpful for checking deep values in a JSON object.
     *
     * @param {function} accessor Function that returns the value
     */
    isset(accessor) {
        try {
            return 'undefined' !== typeof accessor();
        } catch (e) {
            return false;
        }
    }
};

document.addEventListener('DOMContentLoaded', function(event) {
    for (let uriValue of document.getElementsByClassName('uri-value-link')) {
        if (UriDereferencer.getServiceByUri(uriValue.href)) {
            // The data markup container.
            const container = document.createElement('div');
            container.className = 'uri-dereferencer-markup';

            // The toggle button.
            const toggleButton = document.createElement('button');
            toggleButton.className = 'uri-dereferencer-toggle';
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
            fetchButton.className = 'uri-dereferencer-fetch';
            fetchButton.innerHTML = '+';
            fetchButton.onclick = async function() {
                container.innerHTML = await UriDereferencer.dereference(uriValue.href);
                this.remove();
                toggleButton.style.display = 'inline';
            };

            uriValue.parentNode.appendChild(fetchButton);
            uriValue.parentNode.appendChild(toggleButton);
            uriValue.parentNode.appendChild(container);
        }
    }
});
