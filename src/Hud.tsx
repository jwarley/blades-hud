import React from "react";
import ClockBar from "./ClockBar";
import SignIn from "./SignIn";
import Tools from "./Tools";
import Konva from "konva";
import { Clock_t } from "./Types";
import * as util from "./Util";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const players = ["group", "world events", "bricks", "shivers", "dogs", "tick tock"];

interface State {
    user: firebase.User | null;
    group_clocks: Map<string, Clock_t>;
    world_event_clocks: Map<string, Clock_t>;
    player_clocks: { [name: string]: Map<string, Clock_t> };
    current_player: string;
    unsub_fns: Function[];
    dice: number[];
    notes: string;
    view_mode: "clocks" | "map" | "notes";
}


class Hud extends React.PureComponent<{}, State> {
    private db = firebase.firestore();

    constructor(props: {}) {
        super(props);

        const unsub_auth = firebase.auth().onAuthStateChanged(user => {
            this.setState({ user: user });
            this.loadData();
        });

        this.state = {
            user: null,
            group_clocks: new Map(),
            world_event_clocks: new Map(),
            player_clocks: {
                "bricks": new Map(),
                "shivers": new Map(),
                "dogs": new Map(),
                "tick tock": new Map(),
            },
            current_player: "bricks",
            unsub_fns: [unsub_auth],
            dice: [1],
            notes: "",
            view_mode: "clocks",
        };

        this.handle_clock_click = this.handle_clock_click.bind(this);
        this.new_clock = this.new_clock.bind(this);
        this.delete_clock = this.delete_clock.bind(this);
        this.change_player = this.change_player.bind(this);
    }

    public componentWillUnmount() {
        for (const fn of this.state.unsub_fns) {
            fn();
        }
    }

    private loadData() {
        if (this.state.user === null) {
            return
        } else {
            let unsub_funcs: Function[] = [];

            for (let i = 0; i < players.length; i++) {
                unsub_funcs[i] = this.db.collection(players[i] + "_clocks")
                    .orderBy("timestamp", "desc")
                    .onSnapshot(snap => {
                        const clocks = snap.docs.map(doc => doc.data() as Clock_t);
                        const doc_ids = snap.docs.map(doc => doc.id);

                        let gc = new Map<string, Clock_t>();
                        doc_ids.forEach((id, i) => { gc.set(id, clocks[i])});

                        if (players[i] === "group") {
                            this.setState({
                                group_clocks: gc,
                            });
                        } else if (players[i] === "world events") {
                            this.setState({
                                world_event_clocks: gc,
                            });
                        } else {
                            this.setState((state, props) => {
                                return {
                                    ...state,
                                    player_clocks: {
                                        ...state.player_clocks,
                                        [players[i]]: gc,
                                    }
                                }
                            })
                        }
                    });
            }

            this.setState((state, props) => {
                return {
                    ...state,
                    unsub_fns: state.unsub_fns.concat(unsub_funcs),
                }
            });
        }
    }

    private new_clock(owner: string, desc: string, n_slices: number) {
        this.db.collection(owner + "_clocks").add({
            desc: desc,
            n_slices: n_slices,
            progress: 0,
            timestamp: firebase.firestore.Timestamp.now(),
        })
    }

    private incr_clock(c: Clock_t, incr: 1 | -1): Clock_t {
        // Ignore increment/decrement past max value
        if ((incr === 1 && c.n_slices === c.progress) ||
            (incr === -1 && c.progress === 0))
        {
            return c;
        }

        return {
            ...c,
            progress: c.progress + incr,
            n_slices: c.n_slices,
        };
    }

    private handle_clock_click(evt: Konva.KonvaEventObject<MouseEvent>, owner: string, id: string) {
        if (this.state.user === null) {
            alert("Error: You're not logged in! AaaAAh!");
        }

        let e = evt.evt; // the underlying js event
        e.preventDefault();

        // Ignore clicks with buttons other than left or right mb
        if (e.button !== 0 && e.button !== 2) {
            return;
        }

        const incr = e.button === 0 ? 1 : -1;

        // set the new clock
        const clock_doc = this.db.collection(owner + "_clocks").doc(id);

        clock_doc.get().then(a => {
            const old_clock = a.data() as Clock_t;
            clock_doc.set(this.incr_clock(old_clock, incr))
        });
    }

    private delete_clock(id: string, owner: string) {
        this.db.collection(owner + "_clocks").doc(id).delete();
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
            const ordered_players = ["world events", "group"].concat(util.bring_to_front(players.slice(2), this.state.current_player));

            let get_clocks = (owner: string) => {
                if (owner === "group") {
                    return this.state.group_clocks;
                } else if (owner === "world events") {
                    return this.state.world_event_clocks;
                } else {
                    return this.state.player_clocks[owner];
                }
            }

            return (
                <div className="flex">
                    <div className="flex flex-column w-80">
                        {ordered_players.map(owner => {
                            return <div key={owner} className="">
                                <ClockBar owner={owner}
                                          clocks={get_clocks(owner)}
                                          click_func={this.handle_clock_click}
                                          new_func={this.new_clock}
                                          delete_func={this.delete_clock}
                                          />
                            </div>
                        })}
                    </div>
                    <div className="flex-column w-20 outline">
                        <div className="flex flex-wrap">
                            <p className="f4">Which one are you?</p>
                            <select value={this.state.current_player} onChange={this.change_player}>
                                { players.slice(2).map( player => {
                                // slice off the "group" and "world events" players
                                    return <option value={player}>{player}</option>
                                }) }
                            </select>
                        </div>
                        <Tools/>
                        <h3 className="tc">Here look at some map why not?</h3>
                        <button className="bg-blue f3 flex-auto pointer tc br w-100"
                            onClick={()=>window.open("https://cdn.discordapp.com/attachments/613747277881671693/695705793634238554/Bright_Harbor.png")}
                        >
                            Yes, do the aforementioned
                        </button>
                    </div>
                </div>
            );
        }
    }
}

export default Hud;
