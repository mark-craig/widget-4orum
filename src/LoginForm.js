import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './pure-min.css';
import './grids-responsive-min.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      error: false
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit = (event)=>{
    event.preventDefault();
    if (this.props.login(this.state.username, this.state.password)){
      this.setState({error: false});
      this.props.store(this.state.username, this.state.password);
      this.props.close();
    } else {
      this.setState({error: true});
    }
  }



  render() {
    let modalStyle = {
      overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(0, 0, 0, 0.5)'
      },
      content: {
        border: '0',
        borderRadius: '4px',
        bottom: 'auto',
        minHeight: '10rem',
        left: '50%',
        padding: '2rem',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        minWidth: '10rem',
        width: '80%',
        maxWidth: '17.5rem'
      }
    }
    return (
      <Modal
        isOpen={this.props.isOpen}
        style={modalStyle}
        >
        <button className="pure-button cancel-button"
          onClick={(event)=>this.props.close()}>Close</button>
        <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
          <legend>Sign in to 4orum
            <div className="pure-form-message">
              <a target="_blank" href="http://4orum.org/signup" >Or create an account here!</a>
            </div>
          </legend>

          { this.state.error ?
            <div className="alert-error">
              <label>Incorrect username or password</label>
            </div>
            : <div/>
          }
          <input placeholder="Username" className="pure-input-1"
              onChange={this.handleUsernameChange} required/>
          <input type="password" placeholder="Password" className="pure-input-1"
              onChange={this.handlePasswordChange} required/>
          <button type="submit" className="pure-button pure-button-primary pure-input-1">Sign in</button>
        </form>
      </Modal>
    )
  }
}

export default LoginForm;
