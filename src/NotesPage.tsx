import React from "react";
import * as util from "./Util";
import { Notes_t } from "./Types";
import EditNote  from "./EditNote";

import * as firebase from "firebase/app";
import Konva from "konva";


interface State {
    notes: Map<string, Notes_t>;
    editing_notes: string[];
    unsub_fns: Function[];
}

interface Props {
    players: string[];
    user: firebase.User | null;
    current_player: string;
    unsub_fns: Function[];
    db:firebase.firestore.Firestore;
}

class NotesPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            notes:new Map(),
            editing_notes: [],
            unsub_fns:[]
        };
        this.save_note = this.save_note.bind(this)
        this.new_note = this.new_note.bind(this);
        this.delete_note = this.delete_note.bind(this);
        this.edit_note = this.edit_note.bind(this);
        this.cancel_edit_note = this.cancel_edit_note.bind(this);
        this.display_default_note = this.display_default_note.bind(this);
    }

    public componentDidMount(){
        this.loadData();
    }

    public componentWillUnmount() {
        for (const fn of this.state.unsub_fns) {
            fn();
        }
    }

    private loadData() {
        let unsub_func: Function = this.props.db.collection("notes")
            .orderBy("timestamp", "desc")
            .onSnapshot(snap => {
                const notes = snap.docs.map(doc => doc.data() as Notes_t);
                const doc_ids = snap.docs.map(doc => doc.id);
                let gl = new Map<string, Notes_t>();
                doc_ids.forEach((id, i) => { gl.set(id, notes[i])});
                this.setState({
                    notes: gl,
                });
            });

        this.setState((state, props) => {
            return {
                ...state,
                unsub_fns: state.unsub_fns.concat(unsub_func),
            }
        });
    }
    
    private new_note(name: string, type:string, desc:string,) {
        this.props.db.collection("notes").add({
            name:name,
            type:type,
            desc:desc,
            timestamp: firebase.firestore.Timestamp.now(),
        })
    }

    private save_note(id: string, name: string, type:string, desc:string,) {
        const note_doc = this.props.db.collection("notes").doc(id);
        note_doc.set({
            name:name,
            type:type,
            desc:desc,
            timestamp: firebase.firestore.Timestamp.now(),
        })
    }

    private delete_note(id: string) {
        this.props.db.collection("notes").doc(id).delete();
    }

    private edit_note(id:string){
        this.setState((state)=>{
            return({
                ...state, 
                editing_notes:state.editing_notes.concat([id])
            })
        })
    }

    private cancel_edit_note(id:string){
        this.setState((state)=>{
            let new_editing_notes = state.editing_notes.filter(e => e !== id)
            return({
                editing_notes:new_editing_notes
            })
        })
    }

    private display_default_note(id:string, note:Notes_t){
        return <div style={{wordBreak:"break-all", overflow:"auto"}}>
            <h1>{note.name}</h1>
            <h2>{note.type}</h2>
            <p>{note.desc}</p>
            <div className="w-100 flex justify-between">
                <div className="flex flex-wrap" style={{justifyContent:"space-around"}}>
                    <button className="bg-blue f3 flex-auto pointer tc br"
                            onClick={()=>this.edit_note(id)}
                    >
                        Edit
                    </button>
                    <button className="bg-blue f3 flex-auto pointer tc br"
                            onClick={()=>this.delete_note(id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    }

    render(){
        const notes = Array.from(this.state.notes).map((pair) => {
            const id = pair[0]
            const note = pair[1]
            return(
                <div 
                    key={id} 
                    className="mw6 h5 pa1 ba ma2 flex flex-column"
                >
                { this.state.editing_notes.includes(id) ?
                        <EditNote id={id} note={note} save_note={this.save_note} cancel_edit_note={this.cancel_edit_note}/>
                    :
                        this.display_default_note(id, note)
                }
                </div>
            )
        })

        return (
            <div
                className="flex flex-wrap"
            >
                <div 
                    className="mw6 h5 pa1 ba ma2 flex flex-column"
                >
                    <div className="flex-auto overflow-y-auto">
                        <button className="bg-blue f3 flex-auto pointer tc br"
                                onClick={()=>{
                                    this.new_note("New Note", "Type", "Description")
                                }}
                        >
                            NEW NOTE
                        </button>
                    </div>
                </div>
                {notes}
            </div>
        );
    }
}

export default NotesPage;
