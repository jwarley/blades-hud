import React from "react";
import * as util from "./Util";
import { Notes_t } from "./Types";
import EditNote  from "./EditNote";
import * as firebase from "firebase/app";
import Konva from "konva";


interface State {
    notes: Map<string, Notes_t>;
    types: string[];
    filter:string;
    sort:string;
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
            types: [],
            filter:"All",
            sort:"Date",
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
                let types = new Set(["All"]);
                doc_ids.forEach((id, i) => { 
                    gl.set(id, notes[i]);
                    types.add(notes[i].type)
                });
                this.setState({
                    notes: gl,
                    types: Array.from(types) as string[],
                })
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
            <div className="w-100 flex justify-between">
                <div>
                    <h1 className="mv1">{note.name}</h1>
                    <h2 className="mv1">{note.type}</h2>
                </div>
                <button className="bg-grey pointer tc br ml3"
                        onClick={()=>this.edit_note(id)}
                >
                    Edit
                </button>
            </div>
            <hr/>
            <p>{note.desc}</p>
        </div>
    }

    render(){
        const notes_arr = Array.from(this.state.notes)
        if(this.state.sort == "Name"){
            notes_arr.sort((a,b)=>{return a[1].name.localeCompare(b[1].name)})
        }else if(this.state.sort == "Type"){
            notes_arr.sort((a,b)=>{return a[1].type.localeCompare(b[1].type)})
        }
        const notes = notes_arr.map((pair) => {
            const id = pair[0]
            const note = pair[1]
            if(this.state.filter === "All" || this.state.filter ==note.type){
                return(
                    <div 
                        key={id} 
                        className="mw6 h5 pa1 ba ma2 flex flex-column"
                    >
                    { this.state.editing_notes.includes(id) ?
                            <EditNote id={id} note={note} save_note={this.save_note} delete_note={this.delete_note} cancel_edit_note={this.cancel_edit_note}/>
                        :
                            this.display_default_note(id, note)
                    }
                    </div>
                )
            }
        })

        return (
            <div
                className="flex flex-wrap"
            >
                <div 
                    className="mw6 h5 pa1 ba ma2 flex flex-column bg-yellow"
                >
                    <div className="flex-auto overflow-y-auto ">
                        <button className="bg-blue f3 flex-auto pointer tc br"
                                onClick={()=>{
                                    this.new_note("New Note", "Misc", "Description")
                                }}
                        >
                            NEW NOTE
                        </button>
                        <h2>Filter:</h2>
                        <select onChange={(e)=>this.setState({filter:e.target.value})}>
                            {
                            this.state.types.map(t => {
                                return(
                                    <option value={t}>{t}</option>
                                )
                            })
                        }
                        </select>
                        <h2>Sort:</h2>
                        <select onChange={(e)=>this.setState({sort:e.target.value})}>
                            <option value="Date">Date</option>
                            <option value="Name">Name</option>
                            <option value="Type">Type</option>
                        </select>
                    </div>
                </div>

                {notes}
            </div>
        );
    }
}

export default NotesPage;
