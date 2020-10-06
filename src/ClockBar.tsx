import React from "react";
import { Clock_t } from "./Types";
import Clock from "./Clock";

interface Props {
    clocks: Map<string, Clock_t>;
    owner: string;
    click_func: Function;
    new_func: Function;
    delete_func: Function;
}

function ClockBar(props: Props) {
    const clocks = Array.from(props.clocks).map(pair => {
        const id = pair[0];
        const clock = pair[1];

        return (
                <div key={id} className="flex flex-column justify-between outline">
                    <div className="">
                        <Clock
                            clock={clock}
                            incr_func={e => props.click_func(e, props.owner, id)}
                        />
                    </div>
                    <div className="tc pb2">
                            <button className="ba pointer ph1"
                               onClick={() => {
                                   props.delete_func(id, props.owner);
                               }}
                            >Delete</button>
                    </div>
                </div>
        );
    });

    return (
        <div>
            <div className="p0">
                <p className="ttc f3">{props.owner}</p>
            </div>
            <div className="flex bt bb">
                <div className="flex flex-column tc bg-blue pointer justify-center"
                     onClick={ () => {
                         const desc = window.prompt("What's the clock for?", "Nothin'");
                         if(!desc){return;}
                         const n_slices = Number(window.prompt("How many slices?", "4"));
                         if(!n_slices){return;}
                         props.new_func(props.owner, desc, n_slices);
                     }}
                >
                    <div className="f2 w3">+</div>
                </div>

                <div className="flex overflow-x-scroll items-top w-100">
                    {clocks}
                </div>
            </div>
        </div>
    );
}

export default ClockBar;
