import React from "react";
import ReactDOM from "react-dom";
import Hud from "./Hud";
import { WORLD_CLOCK_NAME, GROUP_CLOCK_NAME } from "./ClockPage";
import * as firebase from "firebase/app";
import * as serviceWorker from "./serviceWorker";

var firebaseConfig = {
    apiKey: "AIzaSyAwY_9bJhDtZRn52OWKkU9J3gNklyB2MaU",
    authDomain: "bitd-hud.firebaseapp.com",
    databaseURL: "https://bitd-hud.firebaseio.com",
    projectId: "bitd-hud",
    storageBucket: "bitd-hud.appspot.com",
    messagingSenderId: "87588692405",
    appId: "1:87588692405:web:eb12f6f11340afbc"
};

var players:string[] = [GROUP_CLOCK_NAME, WORLD_CLOCK_NAME];

/***********************************/
/********** GAME SETTINGS **********/
/***********************************/
export const title = "blades in the dark oneshot w/ eli!"
export const oneshot = true;
export const db_email = "bitdoneshot@mailinator.com"; // firestore auth, defaults to this email & all players are given the pw

players.push("fluffers");
players.push("avery");

// var playersRef = db.collection("players");
// playersRef.get().then((querySnapshot) => {
//     querySnapshot.forEach((userDoc) => {
//         players.push(userDoc.data().name);
//     });
// });

export const playerlist = players;

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<Hud />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// export default db;
