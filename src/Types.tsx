import * as firebase from "firebase/app";

export interface Clock_t {
    desc: string;
    progress: number;
    n_slices: number;
    timestamp: firebase.firestore.Timestamp;
}
