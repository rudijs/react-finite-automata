import React, { Component } from "react";
import "./App.css";

import { Machine } from "xstate";

// Authentication state machine
const appMachine = Machine({
  initial: "loggedOut",
  states: {
    loggedOut: {
      onEntry: ["error"],
      on: {
        SUBMIT: "loading"
      }
    },
    loading: {
      on: {
        SUCCESS: "loggedIn",
        FAIL: "loggedOut"
      }
    },
    loggedIn: {
      onEntry: ["setUser"],
      onExit: ["unsetUser"],
      on: {
        LOGOUT: "loggedOut"
      }
    }
  }
});

// Create context and set up defaults.
const Auth = React.createContext({
  authState: "loggedOut",
  error: "",
  logout: () => {},
  user: {}
});

// Display a welcome message to an authenticated user.
const Dashboard = () => (
  <Auth.Consumer>
    {({ user, logout }) => (
      <div className="welcome">
        <h1>Hello, {user.name}!</h1>
        <button
          className="bw0 br1 pa2 bg-green white pointer"
          onClick={e => logout(e)}
        >
          Logout
        </button>
      </div>
    )}
  </Auth.Consumer>
);

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yourName: ""
    };

    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    this.setState({
      yourName: e.target.value
    });
  }

  /**
   * This is where your authentication logic would go. For the purposes
   * of this demo, we're just faking an async request with a setTimeout
   */
  doLogin(e) {
    e.preventDefault();

    this.props.transition({ type: "SUBMIT" });

    setTimeout(() => {
      if (this.state.yourName) {
        return this.props.transition(
          {
            type: "SUCCESS",
            username: this.state.yourName
          },
          () => {
            this.setState({ yourName: "" });
          }
        );
      }

      return this.props.transition({
        type: "FAIL",
        error: "Uh oh, you must enter your name!"
      });
    }, 2000);
  }

  render() {
    return (
      <Auth.Consumer>
        {({ authState, error }) => {
          const errorClass = error ? "error" : "";
          return (
            <form onSubmit={e => this.doLogin(e)} className="login-form">
              <h2>Login to your account</h2>
              <div className="error-message">{error}</div>
              <label htmlFor="yourName">
                <input
                  id="yourName"
                  name="yourName"
                  type="text"
                  autoComplete="off"
                  placeholder="Your name"
                  className={errorClass}
                  value={this.state.yourName}
                  onChange={this.handleInput}
                />
              </label>
              <input
                type="submit"
                value={authState === "loading" ? "Logging in..." : "Login"}
                disabled={authState === "loading" ? true : false}
              />
            </form>
          );
        }}
      </Auth.Consumer>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authState: appMachine.initialState.value,
      error: "",
      logout: e => this.logout(e),
      user: {}
    };
  }

  transition(event) {
    const currentState = this.state.authState;
    const nextAuthState = appMachine.transition(currentState, event.type);

    const nextState = nextAuthState.actions.reduce(
      (state, action) => this.command(action, event) || state,
      undefined
    );

    // Set our new state, along with any variables we might need based on the new state
    this.setState({
      authState: nextAuthState.value,
      ...nextState
    });
  }

  /**
   * Get any variables we need to set in state, based on
   * the onEntry or onExit action for a given state.
   */
  command(action, event) {
    switch (action) {
      case "setUser":
        if (event.username) {
          return { user: { name: event.username }, error: "" };
        }
        break;
      case "unsetUser":
        return {
          user: {}
        };
      case "error":
        if (event.error) {
          return {
            error: event.error
          };
        }
        break;
      default:
        break;
    }
  }

  logout(e) {
    e.preventDefault();
    this.transition({ type: "LOGOUT" });
  }

  render() {
    const { authState } = this.state;

    return (
      <Auth.Provider value={this.state}>
        <div className="App">
          <header className="App-header">
            {authState === "loggedIn" ? (
              <Dashboard />
            ) : (
              <Login transition={event => this.transition(event)} />
            )}
          </header>
        </div>
      </Auth.Provider>
    );
  }
}

export default App;
