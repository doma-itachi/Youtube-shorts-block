export function richShelfFilter() {
    const shelfs = document.querySelectorAll(
        "ytd-rich-shelf-renderer:has(h2>yt-icon:not([hidden]))",
    );
    for (const shelf of shelfs) {
        shelf.remove();
    }
}
