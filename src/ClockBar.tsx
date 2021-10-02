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
    var clocks:any[] = [];
    try {
        clocks = Array.from(props.clocks).map(pair => {
            const id = pair[0];
            const clock = pair[1];

            return (
                    <div key={id} className="flex flex-column justify-between">
                        <div className="">
                            <Clock
                                clock={clock}
                                incr_func={e => props.click_func(e, props.owner, id)}
                            />
                        </div>
                        <div className="tc pb2">
                                <a href="#!" className="bg-light-gray ba ph2 pv1 pointer f6 black no-underline"
                                    onClick={() => {
                                       props.delete_func(id, props.owner);
                                    }}
                                >&#x2715;</a>
                        </div>
                    </div>
            );
        });
    } catch(e) {
        console.error(e);
    }

    return (
        <div>
            <div className="p0">
                <p className="f3 ttl">{props.owner}</p>
            </div>
            <div className="flex">
                <div className="flex flex-column tc bg-light-blue ba bw0 ph2 pv1 pointer justify-center"
                     onClick={ () => {
                         const desc = window.prompt("clock name?", "");
                         if(!desc){return;}
                         const n_slices = Number(window.prompt("number of slices?", "4"));
                         if(!n_slices){return;}
                         props.new_func(props.owner, desc, n_slices);
                     }}
                >
                    <div className="f3" style={{width:"19px", height:"27px", lineHeight:"1.5rem"}}>+</div>
                </div>

                <div className="flex overflow-x-scroll items-top w-100">
                    {clocks}
                </div>
            </div>
        </div>
    );
}

export default ClockBar;
