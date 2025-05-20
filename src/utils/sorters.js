export const alphaNumericSorter = new Intl.Collator('en', {numeric: true, sensitivity: 'accent'}).compare;
export const dateSorter = (a, b) => {
    if (a.date > b.date) return 1;
    if (a.date < b.date) return -1;
    return 0;
}
export const sorterById = (a, b) => {
    if (a?.id > b?.id) return 1;
    if (a?.id < b?.id) return -1;
    return 0;
}
export const getSorter = (func) => {
    return (a, b) => {
        const funcA = func(a);
        const funcB = func(b);
        if (funcA > funcB) return -1;
        if (funcA < funcB) return 1;
        return 0;
    }
}
export const getReversedSorter = (func) => {
    return (a, b) => {
        const funcA = func(a);
        const funcB = func(b);
        if (funcA > funcB) return 1;
        if (funcA < funcB) return -1;
        return 0;
    }
}

export const reverseSorter = (sorter) => {
    return (a, b) => -sorter(a, b)
}
