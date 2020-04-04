import React from "react";
import * as util from "./Util";


interface State {
    notes:string;
}

class Notes extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            notes: "",
        };
    }

    render(){
        return (
            <div className="flex">
                <textarea className="flex-auto" rows={30}>
                  This doesn't actually save, so, ya know, don't really use it yet.
                </textarea>
            </div>
        );
    }
}

export default Notes;
