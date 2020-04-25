import * as React from "react";
import * as firebase from "firebase/app";
import ClockPage from "./ClockPage"
import MapPage from "./MapPage"
import NotesPage from "./NotesPage"
import "firebase/auth";

interface State {
    current_page:string;
}

interface Props {
    players: string[];
    user: firebase.User | null;
    current_player: string;
    unsub_fns: Function[];
    db:firebase.firestore.Firestore;
}

const pages:string[] = ["Clocks", "Map", "Notes"];

class Pages extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            current_page:pages[0],
        };
    }

    render() {
        return(
            <div className="pa1 w-100 vh-100 overflow-y-scroll" >
                <div className="flex flex-wrap" style={{justifyContent:"space-around"}}>
                    {pages.map(page =>{return(
                        <button className="bg-blue f3 flex-auto pointer tc br"
                                onClick={()=>this.setState({current_page:page})}
                        >
                            {page}
                        </button>
                    )})}
                </div>
                <hr/>
                <div style={{display: this.state.current_page==="Clocks" ? 'initial' : 'none' }}>
                    <ClockPage {...this.props}/>
                </div>
                <div style={{display: this.state.current_page==="Map" ? 'initial' : 'none' }}>
                    <MapPage {...this.props}/>
                </div>
                <div style={{display: this.state.current_page==="Notes" ? 'initial' : 'none' }}>
                    <NotesPage {...this.props}/>
                </div>
            </div>
        )
    }
}

export default Pages;
