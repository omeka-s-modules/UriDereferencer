# URI Dereferencer

Dereferences URIs when viewing items, media, and item sets.

## Dereferenceable URIs

Dereferenceable URIs are the backbone of [Linked Data](https://en.wikipedia.org/wiki/Linked_data). Dereferenced resources provide useful information about what a URI identifies when it's looked up. This module allows users to view a snapshot of linked data without having to navigate away from the page (i.e. dereference the URI).

This module will automatically dereference all "URI" data type values that match a registered service. If you want your custom data type values to be dereferenceable, you must add the `uri-value-link` class to the anchor tag containing the URI.

## Linked Data Services

Linked data services are JavaScript objects that are responsible for dereferencing URIs and returning linked data markup. This module already comes with a handful of services:

- [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page)
- [DBpedia](https://wiki.dbpedia.org/)
- [LC Linked Data Service](http://id.loc.gov/)
- [Getty Vocabularies](https://www.getty.edu/research/tools/vocabularies/)
- [OCLC VIAF](https://www.oclc.org/en/viaf.html)
- [Geonames](https://www.geonames.org/)

You can create your own linked data service objects by writing them against the following interface and adding them to the global `UriDereferencer` object.

### Service Interface

```js
{
    /**
     * Get the name of this service.
     * @return {string}
     */
    getName(),
    /**
     * Does this service recognize the URI?
     * @param {string} uri The URI
     * @return {bool}
     */
    isMatch(uri),
    /**
     * Get the resource URL of a URI. The resource URL typically dereferences to
     * an RDF file (JSON-LD, XML, etc.) that represents the URI. Note that the
     * service must have cross-origin resource sharing (CORS) enabled.
     * @param {string} uri The URI
     * @return {string}
     */
    getResourceUrl(uri),
    /**
     * Get the markup derived from the response text.
     * @param {string} uri The URI
     * @param {string} text The response text of the resource
     * @return {string}
     */
    getMarkup(uri, text)
}
```

### Service Implementation Example

```js
UriDereferencer.addService({
    getName() {
        return 'My Linked Data Service';
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        // This example assumes a JSON-LD resource. There are many possible
        // ways to dereference a URL, depending on the service (e.g. RDF/XML,
        // SPARQL endpoint).
        const match = this.getMatch(uri);
        return `http://example.com/vocab/${match[1]}.jsonld`;
    },
    getMarkup(uri, text) {
        // This example assumes JSON response text. You may need to parse the
        // response text differently (e.g. XPath for XML).
        const json = JSON.parse(text);
        return `
        <dl>
            <dt>Label</dt>
            <dd>${json['label']}</dd>
            <dt>Description</dt>
            <dd>${json['description']}</dd>
        </dl>`;
    },
    // Get the URI match (not part of the interface, but useful anyway).
    getMatch(uri) {
        return uri.match(/^https?:\/\/example\.com\/vocab\/(.+)$/);
    }
});
```
