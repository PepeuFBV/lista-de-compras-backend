type Item = {
    name: string
    type: 'padaria' | 'legume' | 'fruta' | 'bebida' | 'carne'
    ammount: number
    unit: string
    status: 'done' | 'todo'
}

function isItem(obj: any): obj is Item {
    return (
        typeof obj.name === 'string' &&
        ['padaria', 'legume', 'fruta', 'bebida', 'carne'].includes(obj.type) &&
        typeof obj.ammount === 'number' &&
        typeof obj.unit === 'string' &&
        ['done', 'todo'].includes(obj.status)
    )
}

export { isItem }

export type { Item }
