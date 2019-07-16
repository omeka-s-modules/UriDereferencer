'use strict'

/**
 * Use to dereference a URI using registered linked data services.
 */
const UriDereferencer = {
    /**
     * The proxy URL.
     */
    proxyUrl: null,
    /**
     * Linked data services.
     */
    services: new Map(),
    /**
     * Add a linked data service object.
     *
     * Note that services are keyed by their name. If services have duplicate
     * names, the last service added will overwrite the previous.
     *
     * @param {object} service A linked data service object
     */
    addService(service) {
        this.services.set(service.getName(), service);
    },
    /**
     * Is a URI dereferenceable?
     *
     * @param {string} uri The URI
     * @return {bool}
     */
    isDereferenceable(uri) {
        const service = this.getServiceByUri(uri);
        if (!service) {
            // No service found.
            return false;
        }
        const resourceUrl = this.getResourceUrlForService(uri, service);
        if (!resourceUrl) {
            // Cannot determine resource URL.
            return false;
        }
        return true;
    },
    /**
     * Dereference a URI and return the linked data markup.
     *
     * @param {string} uri The URI
     * @return {Promise} A promise to return markup
     */
    async dereference(uri) {
        const service = this.getServiceByUri(uri);
        if (!service) {
            console.log(`No service found for URI "${uri}"`);
            return;
        }
        try {
            const resourceUrl = this.getResourceUrlForService(uri, service);
            if (!resourceUrl) {
                throw new Error('Cannot determine resource URL');
            }
            const response = await fetch(resourceUrl);
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`);
            }
            return service.getMarkup(uri, await response.text());
        } catch (error) {
            console.log(`Error in service "${service.getName()}" using URI "${uri}": ${error.message}`);
            return;
        }
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
     * Get a resource URL for a service.
     *
     * @param {string} uri The URI
     * @param {object} service A linked data service object
     * @return {string|false} Returns false if cannot determine resource URL
     */
    getResourceUrlForService(uri, service) {
        const resourceUrl = service.getResourceUrl(uri);
        const options = service.getOptions();
        if (true !== options.useProxy) {
            return resourceUrl;
        }
        if (null !== this.proxyUrl) {
            return `${this.proxyUrl}?resource-url=${encodeURIComponent(resourceUrl)}`;
        }
        return false;
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
