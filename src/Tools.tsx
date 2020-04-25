import * as React from "react";
import Dice from "./Dice"
import Notes from "./Notes"

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
                <Dice/>
            </div>
        )
    }
}

export default Tools;