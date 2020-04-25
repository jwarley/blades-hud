import React from "react";
import map from "./img/bitd_s3_map.png"
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
}

interface Props {
    players: string[];
    user: firebase.User | null;
    current_player: string;
    unsub_fns: Function[];
    db:firebase.firestore.Firestore;
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
        let rect = (e.target as HTMLElement).getBoundingClientRect();
        let x:number = (e.clientX - rect.left)/(e.target as HTMLElement).offsetWidth;
        let y:number = (e.clientY -(e.target as HTMLElement).offsetTop)/(e.target as HTMLElement).offsetHeight;
        console.log((e.target as HTMLElement).offsetTop);
        this.newLandmark(x,y);
    }

    private newLandmark(x:number, y:number){
        this.props.db.collection("landmarks").add({
            x:x,
            y:y,
            desc:"",
            title:"",
            timestamp: firebase.firestore.Timestamp.now(),
        })
    }

    private deleteLandmark(id:string){
        this.props.db.collection("landmarks").doc(id).delete();
    }

    render(){
        return (
            <div>
                <img ref={this.element}
                    className = "w-100"
                    // style={{position:"absolute", left:0, top:0}} 
                    src={map}  
                    onClick={e => this.handleMapClick(e)}/>
                {
                    Array.from(this.state.landmarks).map((pair)=>{
                        const id = pair[0];
                        const landmark = pair[1];
                        return(
                            <FaMapMarkerAlt onClick={()=>this.deleteLandmark(id)} style={{filter: "text-shadow(-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000)", color: "red", position:"absolute", left:this.state.img_width*landmark.x, top:this.state.img_height*landmark.y}}/>
                        )
                    })
                }
            </div>
        );
    }
}

export default MapPage;

