import React from "react";


interface State {
    memos:string;
}

class Memos extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            memos: "",
        };
    }

    render(){
        return (
            <div className="flex">
                <textarea className="flex-auto" rows={30}>
                  (fyi: saving not implemented yet...)
                </textarea>
            </div>
        );
    }
}

export default Memos;
