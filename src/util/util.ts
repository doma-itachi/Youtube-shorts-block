export function logf<T extends string>(message: T, style?: "log" | "error") {
    const composed = `[Youtube-shorts block] ${message}`;
    if (style === "error") {
        console.error(composed);
    } else {
        console.log(composed);
    }
}

export async function querySelectorPromise(
    selectors: string,
    limit = 5,
    interval = 100,
): Promise<Element | null> {
    let element: Element | null;
    for (let i = 0; i < limit; i++) {
        element = document.querySelector(selectors);
        if (element) return element;
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
}

export async function querySelectorAllPromise(
    selectors: string,
    limit = 5,
    interval = 100,
): Promise<NodeListOf<Element>> {
    let elements: NodeListOf<Element> = document.querySelectorAll(selectors);
    if (elements.length !== 0) return elements;
    for (let i = 0; i < limit - 1; i++) {
        await new Promise((resolve) => setTimeout(resolve, interval));
        elements = document.querySelectorAll(selectors);
        if (elements.length !== 0) return elements;
    }
    return elements;
}
