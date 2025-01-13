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
        toggleButton.setAttribute('aria-controls', containerId);
        toggleButton.href = '#';
        toggleButton.innerHTML = '[+]';
        loading = document.createElement('i');
        loading.className = 'loading';
        toggleButton.onclick = async function(e) {
            e.preventDefault();
            if (container.classList.contains('open')) {
                container.classList.remove('open');
                toggleButton.innerHTML = '[+]';
                toggleButton.setAttribute('aria-expanded', 'false');
            } else {
                container.classList.add('open');
                container.focus();
                toggleButton.innerHTML = '[–]';
                toggleButton.setAttribute('aria-expanded', 'true');
            }

            // Only fetch the first time.
            if (toggleButton.classList.contains('fetched') == false) {
                container.innerHTML = loading.outerHTML;
                container.innerHTML = await UriDereferencer.dereference(
                    uriValue.href,
                    uriValue.closest('.value').getAttribute('lang')
                );
                toggleButton.classList.add('fetched');
            }
        };

        uriValue.parentNode.prepend(toggleButton);
        uriValue.parentNode.append(container);
    }
});
