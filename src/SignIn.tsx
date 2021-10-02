import * as React from "react";
import * as firebase from "firebase/app";
import { db_email, title } from "./index";
import "firebase/auth";

interface State {
    email: string,
    pw: string,
}

class SignIn extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            email: "",
            pw: "",
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePwChange = this.handlePwChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            email: event.target.value
        });
    }

    handlePwChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            pw: event.target.value
        });
        const msg = document.getElementById("msg")!;
        msg.innerHTML = "";
    }

    handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        firebase.auth().signInWithEmailAndPassword(db_email, this.state.pw).catch(function(error) {
            console.log(error.message);
            const msg = document.getElementById("msg")!;
            msg.innerHTML = "wrong password!";
        })
        event.preventDefault();
    }

    signOut(event: React.ChangeEvent<HTMLFormElement>) {
        firebase.auth().signOut().catch((error) => {
            console.log(error.message);
        });
    }

    render() {
        return (
          <form onSubmit={this.handleSubmit} className="mw5 mw7-ns center bg-light-gray pa3 ph5-ns mv3">
          <h1 className="mt0">{title}</h1>
            password: <input type="password" value={this.state.pw} onChange={this.handlePwChange} /> <span id="msg" className="red pl2"></span>
            <br />
            <br />
            <input type="submit" value="play!" />
          </form>
        );
    }
}

export default SignIn;