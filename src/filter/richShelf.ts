export function richShelfFilter() {
    const shelfs = document.querySelectorAll("ytd-rich-shelf-renderer");
    for (const shelf of shelfs) {
        shelf.remove();
    }
}
