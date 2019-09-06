import React from "react";
import ReactDOM from "react-dom";
import Hud from "./Hud";
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

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<Hud />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
