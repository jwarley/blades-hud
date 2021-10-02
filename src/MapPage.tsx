import React from "react";
import { CirclePicker } from "react-color";
import map from "./img/doskvol_map.png"
import barrowcleft from "./img/maps/barrowcleft.png"
import brightstone from "./img/maps/brightstone.png"
import charhollow from "./img/maps/charhollow.png"
import charterhall from "./img/maps/charterhall.png"
import coalridge from "./img/maps/coalridge.png"
import crowsfoot from "./img/maps/crowsfoot.png"
import docks from "./img/maps/docks.png"
import dunslough from "./img/maps/dunslough.png"
import nightmarket from "./img/maps/nightmarket.png"
import silkshore from "./img/maps/silkshore.png"
import sixtowers from "./img/maps/sixtowers.png"
import whitecrown from "./img/maps/whitecrown.png"
import grinasberg from "./img/grinasberg.png"
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
        this.handleMapRightClick = this.handleMapRightClick.bind(this);
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
                });
                // }, ()=>console.log(this.state.landmarks));
            });

        this.setState((state, props) => {
            return {
                ...state,
                unsub_fns: state.unsub_fns.concat(unsub_func),
            }
        });
    }

    private handleMapClick(e:React.MouseEvent<HTMLElement>) {
        var currentmap = (e.target as HTMLImageElement);
        if (currentmap.getAttribute("src") !== grinasberg) {
            // treat left click as right click (go back to main map) if on zoomed map
            this.handleMapRightClick(e);
        } else {
            if (this.state.panel_open) {
                this.closePanel();
            } else {
                let rect = (e.target as HTMLElement).getBoundingClientRect();
                let x:number = (e.clientX - rect.left)/(e.target as HTMLElement).offsetWidth;
                let y:number = (e.clientY - rect.top)/(e.target as HTMLElement).offsetHeight;
                let name = window.prompt("landmark name?", "n/a");
                if(!name){return;}
                this.newLandmark(name,x,y);
            }
        }
    }

    private switchImg(e:React.MouseEvent<HTMLElement>, zoomUrl:string) {
        e.preventDefault();
        var img = (e.target as HTMLImageElement);
        img.setAttribute('src', zoomUrl);
        img.setAttribute('style', 'cursor: w-resize');
        var lms = document.getElementsByClassName("landmark");
        for (var i = 0; i < lms.length; i++) {
            lms[i].setAttribute('display', 'none');
        }
    }

    private handleMapRightClick(e:React.MouseEvent<HTMLElement>) {
        // click location
        let rect = (e.target as HTMLElement).getBoundingClientRect();
        let x:number = (e.clientX - rect.left)/(e.target as HTMLElement).offsetWidth;
        let y:number = (e.clientY - rect.top)/(e.target as HTMLElement).offsetHeight;

        var currentmap = (e.target as HTMLImageElement);
        if (currentmap.getAttribute("src") !== grinasberg) {
            e.preventDefault();
            // go back to home, undo switchImg
            currentmap.setAttribute("src", grinasberg);
            currentmap.setAttribute('style', 'cursor: crosshair');
            var lms = document.getElementsByClassName("landmark");
            for (var i = 0; i < lms.length; i++) {
                lms[i].setAttribute('display', 'unset');
            }
        }
        else { // regular right click behavior
            if ((x > 0.5325497287522604) && (y > 0.8484486873508353) &&
                (x < 0.7956600361663653) && (y < 0.9248210023866349)) {
                    this.switchImg(e, barrowcleft)
            } else
            if ((x > 0.1763110307414105) && (y > 0.220763723150358) &&
                (x < 0.3462929475587703) && (y < 0.4904534606205251)) {
                    this.switchImg(e, brightstone)
            } else
            if ((x > 0.5081374321880651) && (y > 0.5119331742243437) &&
                (x < 0.6482820976491862) && (y < 0.665871121718377)) {
                    this.switchImg(e, charhollow)
            } else
            if ((x > 0.3707052441229656) && (y > 0.2732696897374702) &&
                (x < 0.5768535262206148) && (y < 0.4785202863961814)) {
                    this.switchImg(e, charterhall)
            } else
            if ((x > 0.5858951175406871) && (y > 0.3138424821002387) &&
                (x < 0.7848101265822784) && (y < 0.3902147971360382)) {
                    this.switchImg(e, coalridge)
            } else
            if ((x > 0.3933092224231465) && (y > 0.5143198090692124) &&
                (x < 0.5153707052441230) && (y < 0.6992840095465394)) {
                    this.switchImg(e, crowsfoot)
            } else
            if ((x > 0.2613019891500904) && (y > 0.535799522673031) &&
                (x < 0.3824593128390596) && (y < 0.720763723150358)) {
                    this.switchImg(e, docks)
            } else
            if ((x > 0.6708860759493671) && (y > 0.4498806682577566) &&
                (x < 0.8878842676311031) && (y < 0.6026252983293556)) {
                    this.switchImg(e, dunslough)
            } else
            if ((x > 0.5307414104882460) && (y > 0.09307875894988067) &&
                (x < 0.7097649186256781) && (y < 0.28878281622911695)) {
                    this.switchImg(e, nightmarket)
            } else
            if ((x > 0.3833634719710669) && (y > 0.7183770883054893) &&
                (x < 0.6229656419529838) && (y < 0.8293556085918854)) {
                    this.switchImg(e, silkshore)
            } else
            if ((x > 0.3083182640144665) && (y > 0.13126491646778043) &&
                (x < 0.5415913200723327) && (y < 0.25894988066825775)) {
                    this.switchImg(e, sixtowers)
            } else
            if ((x > 0.01808318264014466) && (y > 0.4105011933174224) &&
                (x < 0.24773960216998192) && (y < 0.8866348448687351)) {
                    this.switchImg(e, whitecrown)
            }
        }
    }

    private newLandmark(name:string, x:number, y:number){
        this.props.db.collection("landmarks").add({
            name:name,
            x:x,
            y:y,
            desc:"",
            class:"landmark",
            timestamp: firebase.firestore.Timestamp.now(),
            color:"#f44336"
        }).then(docRef => {
            this.selectLandmark(docRef.id)
        })
        .catch(function(error) {
            console.error("error adding landmark: ", error);
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
        this.setState({panel_open:true})
    }

    private closePanel(){
        this.setState({panel_open:false, selected_landmark:""})
    }

    private changeColor(id:string, color:string){
        const landmark = this.props.db.collection("landmarks").doc(this.state.selected_landmark);
        landmark.set({
            color:color
        }, { merge: true })
    }

    render(){
        let lm = this.state.landmarks.get(this.state.selected_landmark);
        let name = lm?.name ? lm!.name : "n/a";
        let x = lm?.x!*this.state.img_width || 0;
        let y = lm?.y!*this.state.img_height || 0;
        let left = x!>.5*this.state.img_width?"-105%":"5%";
        let top = y!>.5*this.state.img_height?"-125%":"5%";
        return (
            <div style={{position:"relative"}}>
                <img ref={this.element}
                    alt=""
                    className="w-100 mv1"
                    src={grinasberg}
                    id="map"
                    style={{position:"absolute", cursor: this.state.panel_open ? "auto" : "crosshair"}}
                    onClick={e => this.handleMapClick(e)}
                    // onContextMenu={e => this.handleMapRightClick(e)} 
                    />

                {
                    Array.from(this.state.landmarks).map((pair)=>{
                        const id = pair[0];
                        const landmark = pair[1];
                        return(
                            <div
                                key={id}
                                style={{position:"absolute", left:this.state.img_width*landmark.x, top:this.state.img_height*landmark.y, transform:"translateY(-100%) translateX(-50%)"}}
                            >
                                <IconContext.Provider value={{size:this.state.selected_landmark===id?"3em":"2em", color: landmark.color?landmark.color:"red", }}>
                                    <FaMapMarkerAlt
                                        onClick={()=>this.selectLandmark(id)}
                                        className="pointer landmark"
                                    />
                                </IconContext.Provider>
                            </div>
                        )
                    })
                }

                <div style={{position:"absolute", display: this.state.panel_open ? 'flex' : 'none',
                    flexDirection:"column", justifyContent:"space-between",
                    left:x, top:y, transform:"translateY("+top+") translateX("+left+")",
                    width:"40%", minWidth:"350px", minHeight:"75px",
                    backgroundColor:"white", border:"1px solid black", padding:"5px",
                }}>
                    <div>
                        <div className="flex flex-row content-between fr">
                            <button className="bg-red ba ph1 pv1 ma mh1 flex-auto pointer tc br f6"
                                    onClick={()=>this.deleteLandmark(this.state.selected_landmark)}
                            >
                                &#x2715;
                            </button>
                            <button className="bg-grey ba ph1 pv1 ma mh1 flex-auto pointer tc br f6"
                                    onClick={()=>this.closePanel()}
                            >
                                close
                            </button>
                        </div>
                        <h2 className="ma1 label">{name}</h2>
                    </div>
                    <div style={{transform:"scale(0.75)"}}>
                        <CirclePicker
                            colors={["#f44336",  "#9c27b0",  "#3f51b5",  "#03a9f4",  "#009688",  "#8bc34a", "#ff9800",]}
                            width="100%"
                            className="justify-center"
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

