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

const pages:string[] = ["clocks", "map", "notes"];

const pages_map:Map<string,string> = new Map([ // cute emoji ^~^
    ["clocks","\u23F1"],
    ["map","\uD83D\uDDFA"],
    ["notes","\uD83D\uDCDD"],
])

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
                        <a key={page} href="#!"
                            className="bg-light-blue ba bw0 ph2 pv1 mh1 f3 flex-auto pointer tc black no-underline"
                            onClick={()=>this.setState({current_page:page})}
                        >
                            {pages_map.get(page)} {page}
                        </a>
                    )})}
                </div>

                <div style={{display: this.state.current_page==="clocks" ? 'initial' : 'none' }}>
                    <ClockPage {...this.props}/>
                </div>
                <div style={{display: this.state.current_page==="map" ? 'initial' : 'none' }}>
                    <MapPage page_active={this.state.current_page==="map"} {...this.props}/>
                </div>
                <div style={{display: this.state.current_page==="notes" ? 'initial' : 'none' }}>
                    <NotesPage {...this.props}/>
                </div>
            </div>
        )
    }
}

export default Pages;
