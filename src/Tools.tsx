import * as React from "react";
import Dice from "./ToolsDice"
import Memos from "./ToolsMemos"

interface State {
    current_tool:string;
}

const tools:string[] = ["dice"];
// const tools:string[] = ["dice", "memos"];

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
            case "memos":
                return(<Memos/>)
            default:
                return(null)
        }
    }

    render() {
        return(
            <div className="pl1 pr1 pb1">
                <Dice/>
            </div>
        )
    }
}

export default Tools;