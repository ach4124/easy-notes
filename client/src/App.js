import './App.css';
import React from 'react';
import store from './store';
import { hot } from 'react-hot-loader';
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import PostsManager from './components/PostsManager';
import AllPosts from './components/AllPosts';
import ActivePosts from './components/ActivePosts';
import FrontPage from './components/FrontPage';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      msg: '',
      username: '',
      token: '',
    }
  }

  componentDidMount(){
    const obj = JSON.parse(localStorage.getItem('app'))|| '';
      if (obj && obj.token) {
        const { token, username } = obj;
        this.setState({
          token, username
        });
      }
  }

  logout = (e) => {
    e.preventDefault();
    const obj = JSON.parse(localStorage.getItem('app'))|| '';
      if (obj && obj.token) {
        fetch('/logout')
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: ''
            });
            localStorage.setItem('app', JSON.stringify(""));
            window.location.reload();
          }
        });
      }
  }

  render() {
    const { token } = this.state;

    const NavigationWithProps = (props) => {
      return (
        <Navigation username={this.state.username} logout={this.logout} {...props}/>
      )
    }

    if(token){
      return (
        <Provider store={store}>
          <BrowserRouter>
            <div>
              <Route component={NavigationWithProps}/>
              <Switch>
                <Route exact path='/' component={AllPosts} />
                <Route path='/home' component={AllPosts} />
                <Route path='/manager' component={PostsManager} />
                <Route path='/active' component={ActivePosts} />
              </Switch>
            </div>
          </BrowserRouter>
        </Provider>
      );
    } else {
      return (
        <FrontPage/>
      );
    }
  }
}

export default hot(module)(App);