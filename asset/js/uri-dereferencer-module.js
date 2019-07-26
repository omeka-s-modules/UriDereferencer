document.addEventListener('DOMContentLoaded', function(event) {
    for (let uriValue of document.getElementsByClassName('uri-value-link')) {
        if (!UriDereferencer.isDereferenceable(uriValue.href)) {
            continue;
        }
        // The data markup container.
        const container = document.createElement('div');
        container.className = 'uri-dereferencer-markup';

        // The toggle button.
        const toggleButton = document.createElement('a');
        toggleButton.className = 'uri-dereferencer-toggle';
        toggleButton.href = '#';
        toggleButton.innerHTML = '-';
        toggleButton.style.display = 'none';
        toggleButton.onclick = function(e) {
            e.preventDefault();
            if ('none' === container.style.display) {
                container.style.display = 'inline-flex';
                this.innerHTML = '-';
            } else {
                container.style.display = 'none';
                this.innerHTML = '+';
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
            this.remove();
            toggleButton.style.display = 'inline-flex';
        };

        uriValue.parentNode.appendChild(fetchButton);
        uriValue.parentNode.appendChild(toggleButton);
        uriValue.parentNode.appendChild(container);
    }
});
