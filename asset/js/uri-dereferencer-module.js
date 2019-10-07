document.addEventListener('DOMContentLoaded', function(event) {
    let i = 0;
    for (let uriValue of document.getElementsByClassName('uri-value-link')) {
        if (!UriDereferencer.isDereferenceable(uriValue.href)) {
            continue;
        }
        // The data markup container.
        const container = document.createElement('div');
        let containerId = `uri-dereferencer-container-${i}`;
        container.id = containerId;
        container.className = 'uri-dereferencer-markup';
        i++;

        // The toggle button.
        const toggleButton = document.createElement('a');
        toggleButton.className = 'uri-dereferencer-toggle';
        toggleButton.href = '#';
        toggleButton.innerHTML = '-';
        toggleButton.setAttribute('aria-controls', containerId);
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.style.display = 'none';
        toggleButton.onclick = function(e) {
            e.preventDefault();
            if ('none' === container.style.display) {
                container.style.display = 'inline-flex';
                container.focus();
                this.innerHTML = '-';
                this.setAttribute('aria-expanded', 'true');
            } else {
                container.style.display = 'none';
                this.innerHTML = '+';
                this.setAttribute('aria-expanded', 'false');
            }
        };

        // The fetch button.
        const fetchButton = document.createElement('a');
        fetchButton.className = 'uri-dereferencer-fetch';
        fetchButton.href = '#';
        fetchButton.innerHTML = '+';
        loading = document.createElement('i');
        loading.className = 'loading';
        fetchButton.onclick = async function(e) {
            e.preventDefault();
            container.innerHTML = loading.outerHTML;
            container.innerHTML = await UriDereferencer.dereference(uriValue.href);
            container.focus();
            this.remove();
            toggleButton.style.display = 'inline-flex';
            toggleButton.setAttribute('aria-expanded', 'true');
        };

        uriValue.parentNode.appendChild(fetchButton);
        uriValue.parentNode.appendChild(toggleButton);
        uriValue.parentNode.appendChild(container);
    }
});
