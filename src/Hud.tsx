import React from "react";
import SignIn from "./SignIn";
import Pages from "./Pages";
import Tools from "./Tools";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const players = ["group", "world events", "bricks", "shivers", "dogs", "tick tock"];

interface State {
    user: firebase.User | null;
    current_player: string;
    unsub_fns: Function[];
    db:firebase.firestore.Firestore;
}


class Hud extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);

        const unsub_auth = firebase.auth().onAuthStateChanged(user => {
            this.setState({ user: user });
        });


        this.state = {
            user: null,
            current_player: "bricks",
            unsub_fns: [unsub_auth],
            db:firebase.firestore(),
        };

        this.change_player = this.change_player.bind(this);
    }

    public componentWillUnmount() {
        for (const fn of this.state.unsub_fns) {
            fn();
        }
    }

    private change_player(e: React.FormEvent<HTMLSelectElement>) {
        this.setState({
            current_player: e.currentTarget.value,
        });
    }

    public render() {
        // if not signed in
        if (!this.state.user) {
            return (
            <div className="outline">
                <SignIn />
            </div>
            );
        } else { // if signed in
            return (
                <div className="flex">
                    <div className="flex flex-column w-80">
                        <Pages players={players} {...this.state} />
                    </div>
                    <div className="flex-column w-20 outline">
                        <div className="flex flex-wrap">
                            <p className="f4">Which one are you?</p>
                            <select value={this.state.current_player} onChange={this.change_player}>
                                { players.slice(2).map( player => {
                                    return <option value={player}>{player}</option>
                                }) }
                            </select>
                        </div>
                        <Tools/>
                        <hr/>
                        <p className="b f6 tc">
                            Updated 5/2/2020
                        </p>
                    </div>
                </div>
            );
        }
    }
}

export default Hud;
