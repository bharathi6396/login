import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
        <BrowserRouter>
          <Link to={"/"} className="navbar-brand">
            Colibri
          </Link>
          </BrowserRouter>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
            <BrowserRouter>
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
              </BrowserRouter>
            </li>
            {showModeratorBoard && (
              <li className="nav-item">
                <BrowserRouter>
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
                </BrowserRouter>
              </li>
            )}
            {showAdminBoard && (
              <li className="nav-item">
                 <BrowserRouter>
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
                </BrowserRouter>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                 <BrowserRouter>
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
                </BrowserRouter>
              </li>
            )}
          </div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
              <BrowserRouter>
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
                </BrowserRouter>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
              <BrowserRouter>
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
                </BrowserRouter>
              </li>
              <li className="nav-item">
              <BrowserRouter>
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
                </BrowserRouter>
              </li>
            </div>
          )}
        </nav>
       
        <div className="container mt-3">
        <BrowserRouter>
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} />
          </Switch>
         
        </BrowserRouter>
         
        </div>
     

        {/* { <AuthVerify logOut={this.logOut}/>  } */}
      </div>
     
    );
  }
}
export default App;
