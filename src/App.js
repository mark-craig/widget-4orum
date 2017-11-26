import React, { Component } from 'react';
import PieChart from 'react-chartjs-2';
import ReplyForm from './ReplyForm.js';
import logo from './logo.svg';
import './pure-min.css';
import './grids-responsive-min.css';
import './4orum.css'
import 'whatwg-fetch'

const sentiments = ["Awesome", "Funny", "Relatable", "Controversial",
  "Offensive", "False", "Confusing", "True"]
const sentiments_tag= ["EN", "HP", "IN", "CT", "IF", "DA", "CF", "AG"]

const sentiments_colors = {
  "Awesome" : 'rgba(212, 175, 55, 1)',
  "Funny" : 'rgba(255, 255, 0, 1)',
  "Relatable" : 'rgba(132, 132, 255, 1)',
  "Controversial" : 'rgba(255, 128, 0, 1)',
  "Offensive" : 'rgba(255, 0, 0, 1)',
  "False" : 'rgba(0, 0, 255, 1)',
  "Confusing" : 'rgba(255, 105, 180, 1)',
  "True" : 'rgba(0, 255, 0, 1)',
}

class App extends Component {
  constructor(props) {
    super(props);
    // Set our beginning state to be our initial data
    this.state = {
      replies: {},
      root_comments: [],
      replyFormIsOpen: false
    }
    this.update = this.update.bind(this);
    this.handleData = this.handleData.bind(this);
    this.getRepliesForComment = this.getRepliesForComment.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.openReplyForm = this.openReplyForm.bind(this);
    this.closeReplyForm = this.closeReplyForm.bind(this);
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

  /*Open or close the replyForm for replying to comments*/
  openReplyForm() {
    this.setState({replyFormIsOpen: true});
  }
  closeReplyForm() {
    this.setState({replyFormIsOpen: false});
  }


  /*When our component mounts onto the DOM, get data from our server */
  componentDidMount() {
    console.log("component mounted");
    this.update("post/6/");
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
      <div className="pure-menu pure-menu-horizontal">
      <a href="#" className="pure-menu-heading pure-menu-link">4orum</a>
      <ul className="pure-menu-list">
        <li className="pure-menu-item"><a href="#" className="pure-menu-link">About</a></li>
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
      { this.state.replyFormIsOpen
        ?
        <div style={{"padding":'2em'}}>
        <Button
          label={"Cancel"}
          style={{'float': 'right', 'background-color':'red'}}
          onClick={this.closeReplyForm}
        />
        <ReplyForm
          sentiments={sentiments}
          sentiments_colors={sentiments_colors}
        />
        </div>
        : <CommentList
          comments={this.state.root_comments}
          getReplies={this.getRepliesForComment}
          depth={0}
          openReplyForm={this.openReplyForm}
          />
      }
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
      tag={comment.thoughts}
      text={comment.text}
      id={comment.id}
      key={comment.id}
      getReplies={props.getReplies}
      depth={props.depth + 1}
      openReplyForm={props.openReplyForm}
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
            openReplyForm={this.props.openReplyForm}
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
      <div className="comment-header"
        style={{backgroundColor: sentiments_colors[sentiments[sentiments_tag.indexOf(this.props.tag)]]}}>
      <h3>
      <strong>{this.props.author}</strong> thinks this is {sentiments[sentiments_tag.indexOf(this.props.tag)]}
      </h3>
      </div>
      <div className="comment-body">
      <p className="comment-text">{this.props.text}</p>
      </div>
      <div className="comment-footer">
      <Button
        onClick={this.props.openReplyForm}
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
