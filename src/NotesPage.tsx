import React from "react";
import * as util from "./Util";
import { Notes_t } from "./Types";
import * as firebase from "firebase/app";
import Konva from "konva";


interface State {
    notes: Map<string, Notes_t>;
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
            unsub_fns:[]
        };
        this.save_note = this.save_note.bind(this)
        this.new_note = this.new_note.bind(this);
        this.delete_note = this.delete_note.bind(this);
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
    
    private new_note(name: string, desc:string, type:string) {
        this.props.db.collection("notes").add({
            name:name,
            desc:desc,
            type:type,
            timestamp: firebase.firestore.Timestamp.now(),
        })
    }

    private save_note(id: string, name: string, desc:string, type:string) {
        const note_doc = this.props.db.collection("notes").doc(id);
        note_doc.set({
            name:name,
            desc:desc,
            type:type,
            timestamp: firebase.firestore.Timestamp.now(),
        })
    }

    private delete_note(id: string) {
        this.props.db.collection("notes").doc(id).delete();
    }

    render(){
        return (
            <div>
                {Array.from(this.state.notes).map((pair) => {
                    const id = pair[0]
                    const note = pair[1]
                    return <div key={id} className="">
                        <h1>{note.name}</h1>
                        <h2>{note.type}</h2>
                        <p>{note.desc}</p>
                    </div>
                })}
            </div>
        );
    }
}

export default NotesPage;
