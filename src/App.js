import React, { Component } from 'react';
import logo from './logo.svg';
import './pure-min.css';
import './4orum.css'
import 'whatwg-fetch'

class App extends Component {
  constructor(props) {
    super(props);
    // Set our beginning state to be our initial data
    this.state = {
      comments: []
    }
    this.update = this.update.bind(this);
  }

  /*Given a url to our api, update state with new data*/
  update(url) {
    console.log(this)
    fetch(url)
      .then((response) => {
        return response.json()
      }).then((json) => {
          console.log('parsed json', json);
          this.setState({'comments' : json.comments})
        }).catch((ex) => {
          console.log('parsing failed', ex)
        })
  }

  /*When our component mounts onto the DOM, get data from our server */
  componentDidMount() {
    console.log("component mounted");
    this.update("https://comments-4orum.herokuapp.com/posts/1/?format=json");
  }
  render() {
    if (this.state.comments){
    return (
      <div className="App">
        <div className="pure-g">
          <div className="pure-u-1 pure-u-lg-3-4">
            {this.state.comments.map((comment) =>
              <Comment
                author={comment.author}
                thought={comment.thought}
                text={comment.text}
                id={comment.id} />
              )}
            </div>
          </div>
      </div>
    );
    } else {
      return(<div className="App"/>);
    }
  }
}

/*
Comment has the following fields:
author, thought, text, id
*/
class Comment extends Component {
  render() {
    return (
      <div className="comment" key={this.props.id}>
        <div className="comment-header">
          <h3>
          <strong>{this.props.author}</strong> thinks the post is {this.props.thought}
          </h3>
        </div>
        <div className="comment-body">
            <p className="comment-text">{this.props.text}</p>
        </div>
        <div className="comment-footer">
        </div>
      </div>
    );
  }
}

/*
Button takes in a label, and a function that corresponds to onClick.
*/
function Button(props) {
  return (
    <button type="button" className="pure-button" onClick={props.onClick}>
      {this.props.label}
    </button>
  )
}

export default App;
