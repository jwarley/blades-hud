import * as React from "react";
import * as firebase from "firebase/app";
import Dice from "./Dice"
import Notes from "./Notes"
import "firebase/auth";

interface State {
    current_tool:string;
}

const tools:string[] = ["dice"];
// const tools:string[] = ["dice", "notes"];


class Tools extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            current_tool:tools[0],
        };
        this.renderSwitch = this.renderSwitch.bind(this);
    }

    renderSwitch(option:string){
        switch(option){
            case "dice":
                return(<Dice/>)
            case "notes":
                return(<Notes/>)
            default:
                return(null)
        }
    }

    render() {
        return(
            <div className="pa1">
                <hr/>
                <div className="flex flex-wrap" style={{justifyContent:"space-around"}}>
                    {tools.map(tool =>{return(
                        <button className="bg-blue f3 flex-auto pointer tc br"
                                onClick={()=>this.setState({current_tool:tool})}
                        >
                            {tool}
                        </button>
                    )})}
                </div>
                <hr/>
                {this.renderSwitch(this.state.current_tool)}
            </div>
        )
    }
}

export default Tools;