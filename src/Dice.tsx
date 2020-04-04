import React from "react";

interface Props {
    dice: number[];
    click_func: Function;
    new_func: Function;
    delete_func: Function;
}

function Dice(props: Props) {

    const dice = props.dice.map((num, index) => {
        return(
            <div className="w3 h3 ba br2 pointer bg-yellow tc flex flex-column justify-center ma2"
                 onClick={()=>props.click_func(index)}
            >
                <div className="f2">{num}</div>
            </div>
        )
    });

    return (
        <div className="pa2">
            <h2>Here roll some dice why not</h2>
            <div className="flex" style={{justifyContent:"space-around"}}>
                <button className="bg-blue f2 flex-auto pointer tc br"
                    onClick = {()=>props.delete_func()}
                >
                    -
                </button>
                <button className="bg-blue f2 flex-auto pointer tc"
                    onClick = {()=>props.new_func()}
                >
                    +
                </button>
            </div>
            <div className="flex flex-wrap justify-around">
                {dice}
            </div>
            <div className="flex" style={{justifyContent:"space-around"}}>
                <button className="bg-blue f2 flex-auto pointer tc br"
                    onClick = {()=>{
                        props.dice.map((num, index) => props.click_func(index));
                    }}
                >
                    Roll Alll
                </button>
            </div>
        </div>
    );
}

export default Dice;
