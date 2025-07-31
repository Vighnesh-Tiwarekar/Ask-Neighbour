
export const handletextarea = () => {
    const desc = document.getElementById('desc');
    const udesc = document.getElementById('udesc');

    if (desc) {
        const resize = () => {
            desc.style.height = 'auto';
            desc.style.height = desc.scrollHeight + 'px';
        };

        desc.addEventListener('input', resize);
        resize();
    }

    if (udesc) {
        const resize = () => {
            udesc.style.height = 'auto';
            udesc.style.height = udesc.scrollHeight + 'px';
        };

        udesc.addEventListener('input', resize);
        resize();
    }
};