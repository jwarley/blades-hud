import React from "react";
import * as util from "./Util";

interface State {
    dice:number[];
    color:string;
}

class Dice extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            dice: [0],
            color: 'yellow',
        };
    }

    private new_die() {
        this.setState((state)=>({dice:[...state.dice, 0]}));
    }

    private delete_die() {
        this.setState((state)=>({dice:state.dice.slice(0,-1)}));
    }

    private empty_dice() {
        this.setState((state)=>({dice:[]}));
    }

    private change_colors() {
        const colors =
        ["tomato", "orange", "dodgerblue", "greenyellow", "lawngreen", "lavenderblush",
        "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightpink", "lightskyblue",
        "lightsalmon", "navajowhite", "papayawhip", "paleturquoise", "powderblue", "thistle"];
        this.setState((state)=>({color:colors[Math.floor(Math.random()*colors.length)]}));
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
                <div key={index} className="w3 h3 ba bw1 pointer tc flex flex-column justify-center ma2 br3 dice"
                style={{backgroundColor:this.state.color}}
                     onClick={()=>this.handle_die_click(index)}
                >
                    <div className="dice-number f2">{num.toString().replace("0", "\u22EF")}</div>
                </div>
            )
        });

        return (
        <div className="mv3">
            <h3 className="tc mt0 mb2">&#x1F3B2; dice</h3>
            <div className="flex" style={{justifyContent:"space-around"}}>
                <a href="#!" className="bg-light-blue ba bw0 ph2 pv1 ma mh1 f3 flex-auto pointer tc black no-underline"
                    onClick = {()=>this.empty_dice()}
                >
                    0
                </a>
                <a href="#!" className="bg-light-blue ba bw0 ph2 pv1 ma mh1 f3 flex-auto pointer tc black no-underline"
                    onClick = {()=>this.delete_die()}
                >
                    &minus;
                </a>
                <a href="#!" className="bg-light-blue ba bw0 ph2 pv1 ma mh1 f3 flex-auto pointer tc black no-underline"
                    onClick = {()=>this.state.dice.length < 9 ? this.new_die() : undefined}
                >
                    +
                </a>
            </div>
            <div className="mv1 flex flex-wrap justify-around">
                {dice}
            </div>
            <div className="flex" style={{justifyContent:"space-around"}}>
                <a href="#!" className="bg-light-blue ba bw0 ph2 pv1 ma mh1 f4 flex-auto pointer tc black no-underline"
                    onClick = {()=>{
                        this.state.dice.map((num, index) => this.handle_die_click(index));
                    }}
                >
                    roll all
                </a>
                <a href="#!" className="bg-light-blue ba bw0 ph2 pv1 ma mh1 f4 pointer tc black no-underline"
                    onClick = {()=>{
                        this.state.dice.map((num, index) => this.change_colors());
                    }}
                >
                    &#x1F308;
                </a>
            </div>
            <div className="mb0">
                <h3 className="tc mt3 mb2">&#x1f5d2; memo pad</h3>
                <textarea className="w-100 f6" rows={10}>
                </textarea>
                <br />
                <div className="tc f7">(does not save &ndash; this session only)</div>
            </div>
        </div>
    ); // add memo pad support at the bottom of the dice tool, for now
    }
}

export default Dice;
