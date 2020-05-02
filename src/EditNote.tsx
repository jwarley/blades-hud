import React from "react";
import { Notes_t } from "./Types";

interface Props {
    id:string;
    note: Notes_t;
    save_note:Function;
    cancel_edit_note:Function;
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

    private handle_change(event:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>, field:"name"|"type"|"desc"){
        this.setState(updateState(field, event.target.value!))
    }

    public render() {
        return <div >
            <input type="text" value={this.state.name} onChange={(e)=>this.handle_change(e, "name")} />
            <input type="text" value={this.state.type} onChange={(e)=>this.handle_change(e, "type")} />
            <textarea value={this.state.desc} onChange={(e)=>this.handle_change(e, "desc")} />
            <div className="w-100 flex justify-between">
                <div className="flex flex-wrap" style={{justifyContent:"space-around"}}>
                    <button className="bg-blue f3 flex-auto pointer tc br"
                            onClick={()=>this.props.cancel_edit_note(this.props.id)}
                    >
                        Cancel
                    </button>
                    <button className="bg-blue f3 flex-auto pointer tc br"
                            onClick={()=>{
                                this.props.save_note(this.props.id, this.state.name, this.state.type, this.state.desc)
                                this.props.cancel_edit_note(this.props.id)
                            }}
                    >
                        Save
                    </button>
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
