/**
 * en: Remove short video from registration page.
 *      Don't need it now that it is separated?
 * ja: 登録ページからショート動画を削除する
 *      現在は分離されているので要らない？
 */
export function channelFilter() {
    const items = document.querySelectorAll("ytd-rich-item-renderer");
    for (const item of items) {
        if (item.querySelector("span[aria-label='Shorts']")) {
            item.remove();
        }
    }
}
