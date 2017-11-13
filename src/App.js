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
      replies: {},
      root_comments: []
    }
    this.update = this.update.bind(this);
    this.handleData = this.handleData.bind(this);
    this.getRepliesForComment = this.getRepliesForComment.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.api_url = "https://comments-4orum.herokuapp.com/api2/v1/"
  }

  /* Given some comment data, sort it into replies and root comments, */
  handleData(data) {
    if (data.comments) {
      // We have been given a list of comments for a post
      data.comments.map(comment => {
        if (comment.parent_id == null) {
          // add this comment to the root comments just below the post
          this.setState({root_comments: this.state.root_comments.concat(comment)});
        } else {
          // add this comment to the list of replies for another comment
          const n_replies = this.state.replies;
          if (!n_replies[comment.parent_id]) {
            n_replies[comment.parent_id] = [comment];
          } else {
            n_replies[comment.parent_id].push(comment);
          }
          this.forceUpdate();
        }})
    }
  }

  /*Given a url to our api, update state with new data*/
  update(route) {
    fetch(this.api_url + route)
    .then(results => {
      return results.json();
    }).then(data => {
      this.handleData(data);
    })
  }

  /*When our component mounts onto the DOM, get data from our server */
  componentDidMount() {
    console.log("component mounted");
    this.update("post/2/");
  }

  getRepliesForComment(comment_id) {
    if (this.state.replies[comment_id]) {
      return this.state.replies[comment_id];
    } else {
      return [];
    }
  }

  renderHeader() {
    return (
      <div class="pure-menu pure-menu-horizontal">
      <a href="#" class="pure-menu-heading pure-menu-link">4orum</a>
      <ul class="pure-menu-list">
        <li class="pure-menu-item"><a href="#" class="pure-menu-link">About</a></li>
      </ul>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
      {this.renderHeader()}
      <div className="pure-g">
      <div className="pure-u-1">
      <CommentList
        comments={this.state.root_comments}
        getReplies={this.getRepliesForComment}
        depth={0}
        />
      </div>
      </div>
      </div>
    );
  }
}

function CommentList(props) {
  let comments = [];
  if (props.comments) {
    comments = props.comments;
  }
  const listItems = comments.map((comment) =>
  <li key={comment.id}>
    <Comment
      author={comment.author}
      sentiment={comment.sentiment}
      text={comment.text}
      id={comment.id}
      key={comment.id}
      getReplies={props.getReplies}
      depth={props.depth + 1}
      />
  </li>
);
  return (
    <ul>{listItems}</ul>
  );
}

/*
Comment has the following fields:
author, thought, text, id
*/
class Comment extends Component {
  replyThread() {
    const replies = this.props.getReplies(this.props.id);
    if (replies) {
      if (this.props.depth < 4) {
        return (
          <CommentList
            comments={replies}
            getReplies={this.props.getReplies}
            depth={this.props.depth}
            />
        );
      } else {
        return (
          <div className="continue-thread">
          <a href="">Continue this thread -> </a>
          </div>
        )
      }
    }
  }

  render() {
    return (
      <div className="comment-group">
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
        label={"Reply"}
      />
      </div>
      </div>
      {this.replyThread()}
      </div>
    );
  }
}

/*
Button takes in a label, and a function that corresponds to onClick.
*/
function Button(props) {
  return (
    <button type="button" style={props.style} className="pure-button" onClick={props.onClick}>
    {props.label}
    </button>
  )
}

export default App;
