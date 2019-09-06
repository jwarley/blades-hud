import * as React from "react";
import * as firebase from "firebase/app";
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
    }

    handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pw).catch(function(error) {
            console.log(error.message);
        })
        event.preventDefault();
    }

    render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              E-mail:
              <input type="text" value={this.state.email} onChange={this.handleEmailChange} />
              Password:
              <input type="password" value={this.state.pw} onChange={this.handlePwChange}  />
            </label>
            <input type="submit" value="Sign In" />
          </form>
        );
    }
}

export default SignIn;