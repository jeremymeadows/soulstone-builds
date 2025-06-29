export function img_name(name?: string): string {
    return (name ?? '').replace(/[^A-Za-z0-9_]/g, '');
}

export async function load(): Promise<{ [category: string]: { [image: string]: string } }> {
    const items = import.meta.glob('./**/*.png') as Record<string, () => Promise<{ default: string }>>;
    return Object.keys(items).reduce(async (promise: any, path: string) => {
        const acc = await promise;
        const name = path.split('/').pop()!.replace('.png', '');
        const category = path.split('/')[1];

        if (!acc[category]) {
            acc[category] = {};
        }

        acc[category][name] = (await items[path]()).default;
        return acc;
    }, {})
}

export function load_sync(): { [category: string]: { [image: string]: string } } {
    const items = import.meta.glob('./**/*.png', { eager: true }) as Record<string, { default: string }>;
    return Object.keys(items).reduce((acc: any, path: string) => {
        const name = path.split('/').pop()!.replace('.png', '');
        const category = path.split('/')[1];

        if (!acc[category]) {
            acc[category] = {};
        }

        acc[category][name] = items[path].default;
        return acc;
    }, {})
}