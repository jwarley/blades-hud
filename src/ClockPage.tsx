import React from "react";
import * as util from "./Util";
import { Clock_t } from "./Types";
import ClockBar from "./ClockBar";
import * as firebase from "firebase/app";
import Konva from "konva";


interface State {
    group_clocks: Map<string, Clock_t>;
    world_event_clocks: Map<string, Clock_t>;
    player_clocks: { [name: string]: Map<string, Clock_t> };
    unsub_fns: Function[];
}

interface Props {
    players: string[];
    user: firebase.User | null;
    current_player: string;
    unsub_fns: Function[];
    db:firebase.firestore.Firestore;
}

class ClockPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            group_clocks: new Map(),
            world_event_clocks: new Map(),
            player_clocks: {
                "bricks": new Map(),
                "shivers": new Map(),
                "dogs": new Map(),
                "tick tock": new Map(),
            },
            unsub_fns:[]
        };
        this.handle_clock_click = this.handle_clock_click.bind(this);
        this.new_clock = this.new_clock.bind(this);
        this.delete_clock = this.delete_clock.bind(this);
    }

    public componentDidMount(){
        this.loadData();
    }

    public componentWillUnmount() {
        for (const fn of this.state.unsub_fns) {
            fn();
        }
    }

    private loadData() {
        let unsub_funcs: Function[] = [];

        for (let i = 0; i < this.props.players.length; i++) {
            unsub_funcs[i] = this.props.db.collection(this.props.players[i] + "_clocks")
                .orderBy("timestamp", "desc")
                .onSnapshot(snap => {
                    const clocks = snap.docs.map(doc => doc.data() as Clock_t);
                    const doc_ids = snap.docs.map(doc => doc.id);

                    let gc = new Map<string, Clock_t>();
                    doc_ids.forEach((id, i) => { gc.set(id, clocks[i])});

                    if (this.props.players[i] === "group") {
                        this.setState({
                            group_clocks: gc,
                        });
                    } else if (this.props.players[i] === "world events") {
                        this.setState({
                            world_event_clocks: gc,
                        });
                    } else {
                        this.setState((state, props) => {
                            return {
                                ...state,
                                player_clocks: {
                                    ...state.player_clocks,
                                    [this.props.players[i]]: gc,
                                }
                            }
                        })
                    }
                });

            this.setState((state, props) => {
                return {
                    ...state,
                    unsub_fns: state.unsub_fns.concat(unsub_funcs),
                }
            });
        }
    }
    
    private new_clock(owner: string, desc: string, n_slices: number) {
        this.props.db.collection(owner + "_clocks").add({
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
        if (this.props.user === null) {
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
        const clock_doc = this.props.db.collection(owner + "_clocks").doc(id);

        clock_doc.get().then(a => {
            const old_clock = a.data() as Clock_t;
            clock_doc.set(this.incr_clock(old_clock, incr))
        });
    }

    private delete_clock(id: string, owner: string) {
        this.props.db.collection(owner + "_clocks").doc(id).delete();
    }

    render(){
        const ordered_players = ["world events", "group"].concat(util.bring_to_front(this.props.players.slice(2), this.props.current_player));

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
            <div>
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
        );
    }
}

export default ClockPage;
