function bring_to_front(arr: string[], item: string): string[] {
    const target_idx = arr.indexOf(item);
    // arr.splice(target_idx, 1);
    // arr.splice(0, 0, item);
    // return arr;
    let cpy = arr.slice(0);
    cpy.splice(target_idx, 1);
    cpy.splice(0, 0, item);
    return cpy;
};

export {bring_to_front};