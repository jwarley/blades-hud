import * as firebase from "firebase/app";

export interface Clock_t {
    desc: string;
    progress: number;
    n_slices: number;
    timestamp: firebase.firestore.Timestamp;
}

export interface Landmark_t {
    name:string;
    desc: string;
    type:string;
    x:number;
    y:number;
    timestamp: firebase.firestore.Timestamp;
}

export interface Notes_t {
    name:string;
    desc: string;
    type:string;
    timestamp: firebase.firestore.Timestamp;
}