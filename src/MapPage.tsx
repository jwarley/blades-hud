import React from "react";
import { CirclePicker } from "react-color";
import map from "./img/bitd_s4_map.jpg"
import { Landmark_t } from "./Types";
import * as firebase from "firebase/app";
import {FaMapMarkerAlt} from 'react-icons/fa';
import { IconContext } from "react-icons";

interface State {
    landmarks: Map<string, Landmark_t>;
    unsub_fns: Function[];
    open_id:string;
    img_height:number;
    img_width:number;
    panel_open:boolean;
    selected_landmark:string;
}

interface Props {
    players: string[];
    user: firebase.User | null;
    current_player: string;
    unsub_fns: Function[];
    db:firebase.firestore.Firestore;
    page_active:boolean;
}

class MapPage extends React.PureComponent<Props, State> {

    private element = React.createRef<HTMLImageElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            landmarks:new Map(),
            unsub_fns:[],
            open_id:"",
            img_height:0,
            img_width:0,
            panel_open:false,
            selected_landmark:"",
        };
        this.handleMapClick = this.handleMapClick.bind(this);
        this.newLandmark = this.newLandmark.bind(this);
        this.deleteLandmark = this.deleteLandmark.bind(this);
    }

    public componentDidMount(){
        this.loadData();
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    public componentWillUnmount() {
        for (const fn of this.state.unsub_fns) {
            fn();
        }
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    componentDidUpdate(prevProps:Props) {
        if (this.props.page_active !== prevProps.page_active) {
            this.updateDimensions()
        }
    }

    private updateDimensions() {
        const element = this.element.current!
        this.setState({img_height:element.clientHeight, img_width:element.clientWidth})
    }

    private loadData() {
        let unsub_func: Function = this.props.db.collection("landmarks")
            .orderBy("timestamp", "desc")
            .onSnapshot(snap => {
                const landmarks = snap.docs.map(doc => doc.data() as Landmark_t);
                const doc_ids = snap.docs.map(doc => doc.id);
                let gl = new Map<string, Landmark_t>();
                doc_ids.forEach((id, i) => { gl.set(id, landmarks[i])});
                this.setState({
                    landmarks: gl,
                }, ()=>console.log(this.state.landmarks));
            });

        this.setState((state, props) => {
            return {
                ...state,
                unsub_fns: state.unsub_fns.concat(unsub_func),
            }
        });
    }

    private handleMapClick(e:React.MouseEvent<HTMLElement>){
        if(this.state.panel_open){
            this.closePanel();
        }else{
            let rect = (e.target as HTMLElement).getBoundingClientRect();
            let x:number = (e.clientX - rect.left)/(e.target as HTMLElement).offsetWidth;
            let y:number = (e.clientY - rect.top)/(e.target as HTMLElement).offsetHeight;
            let name = window.prompt("What would you like to call this landmark?", "[N/A]");
            if(!name){return;}
            this.newLandmark(name,x,y);
        }
    }

    private newLandmark(name:string, x:number, y:number){
        this.props.db.collection("landmarks").add({
            name:name,
            x:x,
            y:y,
            desc:"",
            timestamp: firebase.firestore.Timestamp.now(),
            color:"#f44336"
        }).then(docRef => {
            this.selectLandmark(docRef.id)
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    private deleteLandmark(id:string){
        this.props.db.collection("landmarks").doc(id).delete();
        this.closePanel();
    }

    private selectLandmark(id:string){
        if(id===this.state.selected_landmark){
            this.closePanel();
        }else{
            this.setState({selected_landmark:id});
            this.showPanel(id);
        }
    }

    private showPanel(id:string){
        // this.props.db.collection("landmarks").doc(id).delete();
        this.setState({panel_open:true})
    }

    private closePanel(){
        // this.props.db.collection("landmarks").doc(id).delete();
        this.setState({panel_open:false, selected_landmark:""})
    }

    private changeColor(id:string, color:string){
        console.log(color)
        const landmark = this.props.db.collection("landmarks").doc(this.state.selected_landmark);
        landmark.set({
            color:color
        }, { merge: true })
    }

    render(){
        let lm = this.state.landmarks.get(this.state.selected_landmark)
        let name = lm?.name ? lm!.name : "[N/A]"
        let x = lm?.x!*this.state.img_width
        let y = lm?.y!*this.state.img_height
        let left = x!>.5*this.state.img_width?"-105%":"5%";
        let top = y!>.5*this.state.img_height?"-125%":"5%";
        return (
            <div style={{position:"relative"}}>
                <img ref={this.element}
                    className = "w-100" 
                    src={map}  
                    style={{position:"absolute", cursor: this.state.panel_open ? "auto" : "cell"}}
                    onClick={e => this.handleMapClick(e)}/>

                {
                    Array.from(this.state.landmarks).map((pair)=>{
                        const id = pair[0];
                        const landmark = pair[1];
                        return(
                            <div 
                                style={{position:"absolute", left:this.state.img_width*landmark.x, top:this.state.img_height*landmark.y, transform:"translateY(-100%) translateX(-50%)"}}
                            >
                                <IconContext.Provider value={{size:this.state.selected_landmark===id?"3em":"2em", color: landmark.color?landmark.color:"red", }}>
                                    <FaMapMarkerAlt 
                                        onClick={()=>this.selectLandmark(id)} 
                                        className="pointer"
                                    />
                                </IconContext.Provider>
                            </div>
                        )
                    })
                }

                <div style={{position:"absolute", display: this.state.panel_open ? 'flex' : 'none', 
                    flexDirection:"column", justifyContent:"space-between",
                    left: x, top:y, transform: "translateY("+top+") translateX("+left+")",
                    width:"40%", minWidth:"350px", minHeight:"200px", 
                    backgroundColor:"white", border:"1px solid black", padding:"5px",
                }}>
                    <div>
                        <div className="flex flex-row content-between">
                            <button className="bg-grey flex-auto pointer tc br"
                                    onClick={()=>this.closePanel()}
                            >
                                Close
                            </button>
                            <button className="bg-red flex-auto pointer tc br"
                                    onClick={()=>this.deleteLandmark(this.state.selected_landmark)}
                            >
                                Delete
                            </button>
                        </div>
                        <h1 className="ma1">{name}</h1>
                    </div>
                    <div style={{width:"100%"}}>
                        <hr/>
                        <CirclePicker
                            colors={["#f44336",  "#9c27b0",  "#3f51b5",  "#03a9f4",  "#009688",  "#8bc34a", "#ff9800",]}
                            width="350px"
                            color={lm?.color}
                            onChangeComplete={(c,e) =>{ this.changeColor(this.state.selected_landmark, c["hex"])}}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default MapPage;

