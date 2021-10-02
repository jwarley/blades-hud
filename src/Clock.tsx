import React from "react";
import Konva from "konva";
import { Stage, Layer, Wedge, Circle } from "react-konva";
import { Clock_t } from "./Types";

interface Props {
    clock: Clock_t;
    incr_func: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

class Clock extends React.PureComponent<Props, {}> {
    public is_full(c: Clock_t): boolean {
        return c.progress === c.n_slices;
    }

    public is_empty(c: Clock_t): boolean {
        return c.progress === 0;
    }

    public render() {
        const w = 130;
        const h = 130;

        const theta = 360 / this.props.clock.n_slices;
        let slices = [];

        if (this.props.clock.n_slices === 1) {
            slices.push(
                <Circle
                    x={w/2}
                    y={w/2}
                    radius={60}
                    fill={this.props.clock.progress === 1 ? "#a463f2" : "white"}
                    stroke={"black"}
                    strokeWidth={2}
                    onClick={this.props.incr_func}
                    onContextMenu={e => {
                        // Suppress right click menu on clocks
                        e.evt.preventDefault();
                    }}
                />
            );
        } else {
            for (let i = 0; i < this.props.clock.n_slices; i++) {
                slices.push(
                    <Wedge
                        x={w / 2}
                        y={h / 2}
                        radius={60}
                        angle={theta}
                        fill={i < this.props.clock.progress ? "#a463f2" : "white"}
                        stroke={"black"}
                        strokeWidth={2}
                        rotation={i * theta - 90}
                        onClick={this.props.incr_func}
                        onContextMenu={e => {
                            // Suppress right click menu on clocks
                            e.evt.preventDefault();
                        }}
                        key={i.toString()}
                    />
                );
            }
        }

        return (
            <div className="flex flex-column mw5">
                <div className="ph3 mv2 mw5 self-center">
                    <Stage width={w} height={h}>
                        <Layer>{slices}</Layer>
                    </Stage>
                </div>
                <p className="tc ph1 ws-normal">{this.props.clock.desc}</p>
            </div>
        );
    }
}

export default Clock;
