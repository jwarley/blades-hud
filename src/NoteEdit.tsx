import React from "react";
import { Notes_t } from "./Types";

interface Props {
    id:string;
    note: Notes_t;
    save_note:Function;
    cancel_edit_note:Function;
    delete_note:Function;
}

interface State {
    name:string;
    type:string;
    desc:string;
}

class EditNote extends React.PureComponent<Props,  State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            name:this.props.note.name,
            type:this.props.note.type,
            desc:this.props.note.desc
        };
        this.handle_change = this.handle_change.bind(this)
    }

    private handle_change(event:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>|React.ChangeEvent<HTMLSelectElement>, field:"name"|"type"|"desc"){
        this.setState(updateState(field, event.target.value!))
    }

    public render() {
        return <div className="w-100" >
            <div className="w-100 flex justify-between">
                <div className="flex flex-wrap" style={{justifyContent:"space-between"}}>
                    <a href="#!" className="bg-red ba ph2 pv1 pointer tc black no-underline"
                        onClick={()=>this.props.delete_note(this.props.id)}
                    >
                        delete
                    </a>
                </div>
            </div>
            <p className="mv2">
                <label>
                name: <input type="text" value={this.state.name} onChange={(e)=>this.handle_change(e, "name")} />
                </label>
            </p>
            <p className="mv2">
                <label>
                type: <select value={this.state.type} onChange={(e)=>this.handle_change(e, "type")} >
                    <option value="Misc">misc</option>
                    <option value="Person">person</option>
                    <option value="Place">place</option>
                    <option value="Boogins">boogins</option>
                    <option value="Item">item</option>
                    <option value="Concept">concept</option>
                    <option value="Event">event</option>
                </select>
                </label>
            </p>
            <p className="mv2">
                <label>
                description:
                <br />
                <textarea value={this.state.desc} rows={4} style={{width:"100%"}} onChange={(e)=>this.handle_change(e, "desc")} />
                </label>
            </p>
            <div className="w-100 flex justify-between">
                <div className="flex flex-wrap" style={{justifyContent:"space-around"}}>
                    <a href="#!" className="bg-light-gray ba ph2 pv1 pointer tc black no-underline"
                        onClick={()=>this.props.cancel_edit_note(this.props.id)}
                    >
                        cancel
                    </a>
                    <div className="ph1"></div>
                    <a href="#!" className="bg-light-blue ba ph2 pv1 pointer tc black no-underline"
                        onClick={()=>{
                            this.props.save_note(this.props.id, this.state.name, this.state.type, this.state.desc)
                            this.props.cancel_edit_note(this.props.id)
                        }}
                    >
                        save
                    </a>
                </div>
            </div>
        </div>
    }
}

const updateState = <T extends string>(key: keyof State, value: T) => (
  prevState: State
): State => ({
  ...prevState,
  [key]: value
})

export default EditNote;
