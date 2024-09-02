export function shortsFilter() {
    const shorts = document.querySelectorAll(
        "ytd-video-renderer ytd-thumbnail a, ytd-grid-video-renderer ytd-thumbnail a, ytm-video-with-context-renderer a.media-item-thumbnail-container",
    ) as NodeListOf<HTMLAnchorElement>;

    const tags = [
        "YTD-VIDEO-RENDERER",
        "YTD-GRID-VIDEO-RENDERER",
        "YTM-VIDEO-WITH-CONTEXT-RENDERER",
    ];

    for (const i of shorts) {
        if (i.href.indexOf("shorts") != -1) {
            let node = i.parentNode as HTMLElement;
            while (node) {
                if (tags.includes(node.nodeName)) {
                    node.remove();
                    break;
                }
                node = node.parentNode as HTMLElement;
            }
        }
    }
}
