export function richShelfFilter() {

    const selectors = [
        "ytd-rich-shelf-renderer:has(h2>yt-icon:not([hidden]))",
        "grid-shelf-view-model:has(ytm-shorts-lockup-view-model)",
    ];

    for (const s of selectors) {
        const shelfs = document.querySelectorAll(s);
        for (const shelf of shelfs) {
            shelf.remove();
        }
    }
}
