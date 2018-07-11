import React from 'react';

class FrontPage extends React.Component {
  constructor() {
    super();
		this.state = {
      username: '',
			email: '',
			password: '',
			msg: '',
			token: '',
		};
	}

	handleChange = (e) => {
		this.setState({[e.target.name]: e.target.value}); 
	}

	signin = (e) => {
		e.preventDefault();
		fetch('/signin', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password
			})
		})
		.then(response => response.json())
		.then(data => {
			localStorage.setItem('app', JSON.stringify({token: data.token, username: data.username}));
			this.setState({token: data.token, msg: data.message})
			if (data.success){
					window.location.reload();
			}
		})
		.catch(error => {
			this.setState({msg: 'Error logging in.'});
			console.error('Error during authentication', error);
		})
	}

  signup = (e) => {
		e.preventDefault();
		fetch("/signup", {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        username: this.state.username,
				email: this.state.email,
				password: this.state.password
			})
		})
		.then(response => response.json())
		.then(data => {
      this.setState({ msg: data.message, username: data.username });
		})
		.catch(err => console.log(err));
  }
  
  render() {
    return (
      <div>
        <section className="banner-area">
          <div className="container">
            <div className="row fullscreen align-items-center justify-content-between">
              <div className="col-lg-7 col-md-7 banner-left">
                <h1>Easy Notes</h1>
                <p>Edit, manage, search posts easily.</p>
              </div>
              <div className="col-lg-5 col-md-5">
                <i className="glyphicon glyphicon-user"/> <input placeholder="Username" type="text" name="username" onChange={this.handleChange} required/><br/>
                <i className="glyphicon glyphicon-envelope"/> <input placeholder="Email" type="text" name="email" onChange={this.handleChange} required/><br/>
					      <i className="glyphicon glyphicon-lock"/> <input placeholder="Password" type="password" name="password" onChange={this.handleChange} required/>
                <br/> 
                <button className="btn btn-secondary btn-block" onClick={this.signin}>
                  Log In
                </button>
                <button className="btn btn-secondary btn-block" onClick={this.signup}>
                  Sign Up
                </button>
                <br/>
                {this.state.msg}
              </div>
            </div>
          </div>					
        </section>
        <br/>
        <br/>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="text-center">
                <i className="glyphicon glyphicon-edit large"/>
                <h6 className="title text-uppercase">Easy editing</h6>
                <p>Double click to edit title or content</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="glyphicon glyphicon-menu-hamburger large"/>
                <h6 className="title text-uppercase">Post Manager</h6>
                <p>Filter posts with tags, add and remove tags; delete and set active posts</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="glyphicon glyphicon-time large"/>
                <h6 className="title text-uppercase">Autosave</h6>
                <p>Autosave posts after a minute of editing</p>
              </div>
            </div>
          </div>
          <br/>
          <br/>
          <div className="row">
            <div className="col-md-4">
              <div className="text-center">
                <i className="glyphicon glyphicon-th-large large"/>
                <h6 className="title text-uppercase">Note grid</h6>
                <p>Choose the number of posts fitting on a page</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="glyphicon glyphicon-text-background large"/>
                <h6 className="title text-uppercase">Post Custom</h6>
                <p>Change background color, attach an image, audio or video</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="glyphicon glyphicon glyphicon-search large"/>
                <h6 className="title text-uppercase">Search</h6>
                <p>Search old posts with and/or query</p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div id="copyright">
            <p className="small">© 2018 Grace Cheung </p>
          </div>
        </div>
      </div>
    );
  }
}

export default FrontPage;