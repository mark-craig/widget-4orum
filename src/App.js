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
    this.api_url = "https://comments-4orum.herokuapp.com/"
  }

  /*Given a url to our api, update state with new data*/
  update(route) {
    fetch(this.api_url + route)
    .then((response) => {
      return response.json()
    }).then((json) => {
      console.log('parsed json', json);
      json.root_comments
      ? this.setState({'comments' : json.root_comments})
      : this.setState({'comments' : [json]})
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  /*When our component mounts onto the DOM, get data from our server */
  componentDidMount() {
    console.log("component mounted");
    this.update("posts/1/?format=json");
  }

  render() {
    return (
      <div className="App">
      <div className="pure-g">
      <div className="pure-u-1">
      <CommentThread
      comments = {this.state.comments}
      updateRoot = {(route) => this.update(route)}
      />
      </div>
      </div>
      </div>
    )
  }
}

function CommentThread(props) {
  return (
    props.comments.map((comment) =>
        <div className="comment-thread">
        <Comment
        author={comment.author}
        sentiment={comment.sentiment}
        text={comment.text}
        id={comment.id}
        key={comment.id}
        replies={comment.replies}
        updateRoot={props.updateRoot}
        />
        <div className="replies">
        <CommentThread
          comments={comment.replies}
          updateRoot={props.updateRoot}
        />
        </div>
        </div>
        )
      )
}


/*
Comment has the following fields:
author, thought, text, id
*/
class Comment extends Component {
  render() {
    return (
      <div className="comment">
      <div className="comment-header">
      <h3>
      <strong>{this.props.author}</strong> thinks this is {this.props.sentiment}
      </h3>
      </div>
      <div className="comment-body">
      <p className="comment-text">{this.props.text}</p>
      </div>
      <div className="comment-footer">
      <Button
      label={"Responses"}
      onClick={() => this.props.updateRoot('comments/'+this.props.id+'/?format=json')}
      />
      <Button
      label={"Reply"}
      />
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
    {props.label}
    </button>
  )
}

export default App;
