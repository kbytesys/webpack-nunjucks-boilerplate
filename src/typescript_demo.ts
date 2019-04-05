export interface DemoData {
    id: number;
    name: string;
}

export function createDemoItem(): DemoData {
    return {id: 1, name: 'demo'};
}
