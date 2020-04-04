import React from "react";
import * as util from "./Util";


interface State {
    dice:number[];
}

class Dice extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            dice: [1],
        };
    }

    private new_die() {
        this.setState((state)=>({dice:[...state.dice, 1]}));
    }

    private delete_die() {
        this.setState((state)=>({dice:state.dice.slice(0,-1)}));
    }

    private handle_die_click(index:number) {
        this.setState((state)=>{
            const dice = state.dice.map((item, i) => {
                if (i === index) {
                  return util.random_int(6)+1;
                } else {
                  return item;
                }
            });
            return({dice:dice})
        });
    }

    render(){
        const dice = this.state.dice.map((num, index) => {
            return(
                <div className="w3 h3 ba br2 pointer bg-yellow tc flex flex-column justify-center ma2"
                     onClick={()=>this.handle_die_click(index)}
                >
                    <div className="f2">{num}</div>
                </div>
            )
        });

        return (
        <div>
            <h3 className="tc">Here roll some dice why not?</h3>
            <div className="flex" style={{justifyContent:"space-around"}}>
                <button className="bg-blue f2 flex-auto pointer tc br"
                    onClick = {()=>this.delete_die()}
                >
                    -
                </button>
                <button className="bg-blue f2 flex-auto pointer tc"
                    onClick = {()=>this.new_die()}
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
                        this.state.dice.map((num, index) => this.handle_die_click(index));
                    }}
                >
                    Roll All
                </button>
            </div>
        </div>
    );
    }
}

export default Dice;
