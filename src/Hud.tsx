import React from "react";
import Clock from "./Clock";
import Konva from "konva";
import { Clock_t, Player } from "./Types";

interface State {
    group_clocks: Map<string, Clock_t>;
    players: Map<string, Player>;
}

class Hud extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            group_clocks: new Map().set("kill ghost", { progress: 2, n_slices: 5 }),
            players: new Map(),
        };
    }

    private incr_clock(c: Clock_t, incr: 1 | -1): Clock_t {
        return {
            progress: c.progress + incr,
            n_slices: c.n_slices,
        };
    }

    private handle_clock_click(e: Konva.KonvaEventObject<MouseEvent>, owner: string, desc: string) {
        let evt = e.evt;
        evt.preventDefault();

        // Ignore clicks with buttons other than left or right mb
        if (evt.button !== 0 && evt.button !== 2) {
            return;
        }

        const incr = evt.button === 0 ? 1 : -1;

        this.setState((state, props) => {
            let group_clocks_after = state.group_clocks;
            let players_after = state.players;

            if (owner === "group") {
                console.assert(state.group_clocks.get(desc));
                const old_clock = state.group_clocks.get(desc)!;

                // Ignore increment/decrement past max value
                if (incr === 1 && old_clock.n_slices === old_clock.progress) {
                    return { ...state };
                    const new_clock = this.incr_clock(old_clock, incr);
                } else if (incr === -1 && old_clock.progress === 0) {
                    return { ...state };
                }

                const new_clock = this.incr_clock(old_clock, incr);
                group_clocks_after = new Map(state.group_clocks).set(desc, new_clock);
            } else {
                console.assert(state.players.get(owner));
                console.assert(state.players.get(owner)!.clocks.get(desc));
                const old_clock = state.players.get(owner)!.clocks.get(desc)!;

                // Ignore increment/decrement past max value
                if (incr === 1 && old_clock.n_slices === old_clock.progress) {
                    return { ...state };
                    const new_clock = this.incr_clock(old_clock, incr);
                } else if (incr === -1 && old_clock.progress === 0) {
                    return { ...state };
                }

                const new_clock = this.incr_clock(
                    state.players.get(owner)!.clocks.get(desc)!,
                    incr
                );
                const new_owner: Player = {
                    clocks: new Map(state.players.get(owner)!.clocks).set(desc, new_clock),
                };
                players_after = new Map(state.players).set(owner, new_owner);
            }

            return {
                group_clocks: group_clocks_after,
                players: players_after,
            };
        });
    }

    public render() {
        const group_clocks = Array.from(this.state.group_clocks).map(pair => {
            const desc = pair[0];
            const clock = pair[1];

            return (
                <div>
                    <Clock
                        clock={clock}
                        incr_func={e => this.handle_clock_click(e, "group", desc)}
                    />
                    <p>{desc}</p>
                </div>
            );
        });
        return (
            <div>
                <h3>plEasE Enjoy gamE</h3>
                {group_clocks}
            </div>
        );
    }
}

export default Hud;
