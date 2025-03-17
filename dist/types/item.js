function isItem(obj) {
    return (typeof obj.name === 'string' &&
        ['padaria', 'legume', 'fruta', 'bebida', 'carne'].includes(obj.type) &&
        typeof obj.ammount === 'number' &&
        typeof obj.unit === 'string' &&
        ['done', 'todo'].includes(obj.status));
}
export { isItem };
