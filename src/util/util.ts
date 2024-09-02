export function logf<T extends string>(message: T, style?: "log" | "error"){
    const composed = `[Youtube-shorts block] ${message}`;
    if(style==="error"){
        console.error(composed);
    }
    else{
        console.log(composed);
    }
}

export async function querySelectorPromise(selectors: string, limit: number = 5, interval = 100): Promise<Element | null>{
    let element: Element | null;
    for(let i =0;i<limit;i++){
        element = document.querySelector(selectors);
        if(element)return element;
        await new Promise(resolve=>setTimeout(resolve, interval));
    }
    return null;
}