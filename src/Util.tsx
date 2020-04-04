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

function random_int(max:number){
    return Math.floor(Math.random() * Math.floor(max));
}

export {bring_to_front, random_int};