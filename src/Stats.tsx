import React from "react";
import * as util from "./Util";
import "firebase/auth";
import * as firebase from "firebase/app";


interface State {
    user: firebase.User | null;
    player_stats: { [name: string]: Map<string, number> };
    // unsub_fns: Function[];
}

class Stats extends React.PureComponent<{}, State> {
    private db = firebase.firestore();

    constructor(props: {}) {
        super(props);
        // const unsub_auth = firebase.auth().onAuthStateChanged(user => {
        //     this.setState({ user: user });
        //     this.loadData();
        // });
        this.state = {
            user:null,
            player_stats: {"Bricks": new Map()},
            // unsub_fns: [unsub_auth],
        };
        this.renderStats = this.renderStats.bind(this);
    }

    // public componentWillUnmount() {
    //     for (const fn of this.state.unsub_fns) {
    //         fn();
    //     }
    // }

    // private loadData() {
    //     if (this.state.user === null) {
    //         return
    //     } else {
    //         let unsub_funcs: Function = this.db.collection("Stats")
    //             .onSnapshot(snap => {
    //                 const clocks = snap.docs.map(doc => doc.data() as Clock_t);
    //                 const doc_ids = snap.docs.map(doc => doc.id);

    //                 let gc = new Map<string, Clock_t>();
    //                 doc_ids.forEach((id, i) => { gc.set(id, clocks[i])});

    //                 this.setState((state, props) => {
    //                     return {
    //                         ...state,
    //                         player_clocks: {
    //                             ...state.player_clocks,
    //                             [players[i]]: gc,
    //                         }
    //                     }
    //                 })
    //             });

    //         this.setState((state, props) => {
    //             return {
    //                 ...state,
    //                 unsub_fns: state.unsub_fns.concat([unsub_funcs]),
    //             }
    //         });
    //     }
    // }

    renderStats(name:string){
        const stats = Array.from(this.state.player_stats[name]).map(pair=>{
            return(
                <div> Hello </div>
            )
        })
        return(stats)
    }


    render(){
        return (
            <div className="flex">
                {this.renderStats("Bricks")}
            </div>
        );
    }
}

export default Stats;
