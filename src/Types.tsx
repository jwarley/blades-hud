// import Map from "immutable";

export interface Clock_t {
    progress: number;
    n_slices: number;
}

export interface Player {
    // clocks: { [desc: string]: Clock_t };
    clocks: Map<string, Clock_t>;
}
