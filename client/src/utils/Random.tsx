export const random: Function = (): string => {
    return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
};