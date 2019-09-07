(window["webpackJsonpblades-hud"]=window["webpackJsonpblades-hud"]||[]).push([[0],{41:function(e,t,n){e.exports=n(94)},94:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),r=n(40),l=n.n(r),o=n(26),s=n(11),i=n(12),u=n(14),p=n(13),h=n(8),m=n(15),d=n(17),f=function(e){function t(){return Object(s.a)(this,t),Object(u.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(i.a)(t,[{key:"is_full",value:function(e){return e.progress===e.n_slices}},{key:"is_empty",value:function(e){return 0===e.progress}},{key:"render",value:function(){var e=130,t=360/this.props.clock.n_slices,n=[];if(1===this.props.clock.n_slices)n.push(c.a.createElement(d.Circle,{x:65,y:65,radius:60,fill:1===this.props.clock.progress?"gray":"white",stroke:"black",strokeWidth:2,onClick:this.props.incr_func,onContextMenu:function(e){e.evt.preventDefault()}}));else for(var a=0;a<this.props.clock.n_slices;a++)n.push(c.a.createElement(d.Wedge,{x:65,y:65,radius:60,angle:t,fill:a<this.props.clock.progress?"gray":"white",stroke:"black",strokeWidth:2,rotation:a*t-90,onClick:this.props.incr_func,onContextMenu:function(e){e.evt.preventDefault()},key:a.toString()}));return c.a.createElement("div",{className:"flex flex-column mw5"},c.a.createElement("div",{className:"pa3 mw5 self-center"},c.a.createElement(d.Stage,{width:e,height:130},c.a.createElement(d.Layer,null,n))),c.a.createElement("p",{className:"tc pa1 ws-normal"},this.props.clock.desc))}}]),t}(c.a.PureComponent);var b=function(e){var t=Array.from(e.clocks).map(function(t){var n=t[0],a=t[1];return c.a.createElement("div",{key:n,className:"flex flex-column justify-between outline"},c.a.createElement("div",{className:""},c.a.createElement(f,{clock:a,incr_func:function(t){return e.click_func(t,e.owner,n)}})),c.a.createElement("div",{className:"tc pb2"},c.a.createElement("button",{className:"ba pointer ph1",onClick:function(){e.delete_func(n,e.owner)}},"Delete")))});return c.a.createElement("div",null,c.a.createElement("div",{className:"p0"},c.a.createElement("p",{className:"ttc f3"},e.owner)),c.a.createElement("div",{className:"flex outline"},c.a.createElement("div",{className:"flex flex-column tc bg-blue pointer justify-center",onClick:function(){var t=Number(window.prompt("how many slices?","4")),n=window.prompt("what's the clock for?");e.new_func(e.owner,n,t)}},c.a.createElement("div",{className:"f2 w3"},"+")),c.a.createElement("div",{className:"flex overflow-x-scroll items-top w-100"},t)))},k=n(9),v=(n(39),function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(u.a)(this,Object(p.a)(t).call(this,e))).state={email:"",pw:""},n.handleEmailChange=n.handleEmailChange.bind(Object(h.a)(n)),n.handlePwChange=n.handlePwChange.bind(Object(h.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(h.a)(n)),n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"handleEmailChange",value:function(e){this.setState({email:e.target.value})}},{key:"handlePwChange",value:function(e){this.setState({pw:e.target.value})}},{key:"handleSubmit",value:function(e){k.auth().signInWithEmailAndPassword(this.state.email,this.state.pw).catch(function(e){console.log(e.message)}),e.preventDefault()}},{key:"render",value:function(){return a.createElement("form",{onSubmit:this.handleSubmit},a.createElement("label",null,"E-mail:",a.createElement("input",{type:"text",value:this.state.email,onChange:this.handleEmailChange}),"Password:",a.createElement("input",{type:"password",value:this.state.pw,onChange:this.handlePwChange})),a.createElement("input",{type:"submit",value:"Sign In"}))}}]),t}(a.PureComponent));function g(e,t){var n=e.indexOf(t),a=e.slice(0);return a.splice(n,1),a.splice(0,0,t),a}n(91);function w(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?w(n,!0).forEach(function(t){Object(o.a)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):w(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var _=["group","bricks","shivers","dogs","tick tock"],E=function(e){function t(e){var n;Object(s.a)(this,t),(n=Object(u.a)(this,Object(p.a)(t).call(this,e))).db=k.firestore(),console.log(g(_,"dogs")),console.log(_);var a=k.auth().onAuthStateChanged(function(e){n.setState({user:e}),n.loadData()});return n.state={user:null,group_clocks:new Map,player_clocks:{bricks:new Map,shivers:new Map,dogs:new Map,"tick tock":new Map},current_player:"bricks",unsub_fns:[a]},n.handle_clock_click=n.handle_clock_click.bind(Object(h.a)(n)),n.new_clock=n.new_clock.bind(Object(h.a)(n)),n.delete_clock=n.delete_clock.bind(Object(h.a)(n)),n.change_player=n.change_player.bind(Object(h.a)(n)),n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentWillUnmount",value:function(){var e=!0,t=!1,n=void 0;try{for(var a,c=this.state.unsub_fns[Symbol.iterator]();!(e=(a=c.next()).done);e=!0){(0,a.value)()}}catch(r){t=!0,n=r}finally{try{e||null==c.return||c.return()}finally{if(t)throw n}}}},{key:"loadData",value:function(){var e=this;if(null!==this.state.user){for(var t=[],n=function(n){t[n]=e.db.collection(_[n]+"_clocks").orderBy("timestamp","desc").onSnapshot(function(t){var a=t.docs.map(function(e){return e.data()}),c=t.docs.map(function(e){return e.id}),r=new Map;c.forEach(function(e,t){r.set(e,a[t])}),"group"===_[n]?e.setState({group_clocks:r}):e.setState(function(e,t){return y({},e,{player_clocks:y({},e.player_clocks,Object(o.a)({},_[n],r))})})})},a=0;a<_.length;a++)n(a);this.setState(function(e,n){return y({},e,{unsub_fns:e.unsub_fns.concat(t)})})}}},{key:"new_clock",value:function(e,t,n){this.db.collection(e+"_clocks").add({desc:t,n_slices:n,progress:0,timestamp:k.firestore.Timestamp.now()})}},{key:"incr_clock",value:function(e,t){return 1===t&&e.n_slices===e.progress||-1===t&&0===e.progress?e:y({},e,{progress:e.progress+t,n_slices:e.n_slices})}},{key:"handle_clock_click",value:function(e,t,n){var a=this;null===this.state.user&&alert("Error: You're not logged in! AaaAAh!");var c=e.evt;if(c.preventDefault(),0===c.button||2===c.button){var r=0===c.button?1:-1,l=this.db.collection(t+"_clocks").doc(n);l.get().then(function(e){var t=e.data();l.set(a.incr_clock(t,r))})}}},{key:"delete_clock",value:function(e,t){this.db.collection(t+"_clocks").doc(e).delete()}},{key:"change_player",value:function(e){this.setState({current_player:e.currentTarget.value})}},{key:"render",value:function(){var e=this;if(this.state.user){var t=["group"].concat(g(_.slice(1),this.state.current_player));return c.a.createElement("div",{className:"flex"},c.a.createElement("div",{className:"flex flex-column w-80"},t.map(function(t){return c.a.createElement("div",{key:t,className:""},c.a.createElement(b,{owner:t,clocks:"group"===t?e.state.group_clocks:e.state.player_clocks[t],click_func:e.handle_clock_click,new_func:e.new_clock,delete_func:e.delete_clock}))})),c.a.createElement("div",{className:"flex-column w-20 outline"},c.a.createElement("p",{className:"f4"},"Which one are you?"),c.a.createElement("select",{value:this.state.current_player,onChange:this.change_player},_.slice(1).map(function(e){return c.a.createElement("option",{value:e},e)}))))}return c.a.createElement("div",{className:"outline"},c.a.createElement(v,null))}}]),t}(c.a.PureComponent);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));k.initializeApp({apiKey:"AIzaSyAwY_9bJhDtZRn52OWKkU9J3gNklyB2MaU",authDomain:"bitd-hud.firebaseapp.com",databaseURL:"https://bitd-hud.firebaseio.com",projectId:"bitd-hud",storageBucket:"bitd-hud.appspot.com",messagingSenderId:"87588692405",appId:"1:87588692405:web:eb12f6f11340afbc"}),l.a.render(c.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[41,1,2]]]);
//# sourceMappingURL=main.a488ea02.chunk.js.map