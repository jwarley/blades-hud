import React from "react";
import Konva from "konva";
import { Stage, Layer, Wedge, Text } from "react-konva";
import { Clock_t } from "./Types";

interface Props {
    clock: Clock_t;
    incr_func: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

class Clock extends React.PureComponent<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public is_full(c: Clock_t): boolean {
        return c.progress === c.n_slices;
    }

    public is_empty(c: Clock_t): boolean {
        return c.progress === 0;
    }

    // private handleClick(e: Konva.KonvaEventObject<MouseEvent>) {
    //     let evt = e.evt;
    //     evt.preventDefault();

    //     // Ignore clicks with buttons other than left or right mb
    //     // if (e.button !== 0 && e.button !== 2) {

    //     // }

    //     const incr = evt.button === 0 ? 1 : -1;

    //     this.setState((state, props) => {
    //         // Ignore increment/decrement past max value
    //         if (incr === 1 && state.n_slices === state.progress) {
    //             return { ...state };
    //         } else if (incr === -1 && state.progress === 0) {
    //             return { ...state };
    //         }

    //         return {
    //             progress: state.progress + incr,
    //         };
    //     });
    // }

    public render() {
        const w = 200;
        const h = 200;

        const theta = 360 / this.props.clock.n_slices;
        let slices = [];

        for (let i = 0; i < this.props.clock.n_slices; i++) {
            slices.push(
                <Wedge
                    x={w / 2}
                    y={h / 2}
                    radius={60}
                    angle={theta}
                    fill={i < this.props.clock.progress ? "gray" : "white"}
                    stroke={"black"}
                    strokeWidth={2}
                    rotation={i * theta - 90}
                    onClick={this.props.incr_func}
                    onContextMenu={e => {
                        // Suppress right click menu on clocks
                        e.evt.preventDefault();
                    }}
                />
            );
        }

        return (
            <Stage width={w} height={h}>
                <Layer>{slices}</Layer>
            </Stage>
        );

        // return this.drawClock(this.state.n_slices, this.state.progress);
    }
}

export default Clock;
