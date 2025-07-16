
export const isGod = (name: string) => !name.includes('/');
export const isCulture = (name: string) => name.startsWith('Cultures/');
export const isMotif = (name: string) => name.startsWith('Motifs/');
export const isMytheme = (name: string) => name.startsWith('Mythemes/');
