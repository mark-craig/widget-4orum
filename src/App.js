import React, { Component } from 'react';
import ReplyForm from './ReplyForm.js';
import logo from './logo.svg';
import './pure-min.css';
import './grids-responsive-min.css';
import './4orum.css'
import 'whatwg-fetch'

const sentiments = ["Awesome", "Funny", "Sympathetic", "Controversial",
  "Offensive", "False", "Confusing", "True"]
const sentiments_tag= ["EN", "HP", "IN", "CT", "IF", "DA", "CF", "AG"]

const sentiments_map = {
  "Awesome": "EN",
  "Funny": "HP",
  "Sympathetic": "IN",
  "Controversial": "CT",
  "Offensive": "IF",
  "False": "DA",
  "Confusing": "CF",
  "True": "AG"
}

const sentiments_expressions = {
  "Awesome": "I think this is ",
  "Funny": "I find this  ",
  "Sympathetic": "This makes me feel ",
  "Controversial": "I think this is ",
  "Offensive": "I find this ",
  "False": "I think this is ",
  "Confusing": "I find this ",
  "True": "I think this is "
}


const sentiments_colors = {
  "Awesome" : 'rgba(108,190,237,1)',
  "Funny" : 'rgba(253, 229, 65, 1)',
  "Sympathetic" : 'rgba(255,105,180, 1)',
  "Controversial" : 'rgba(255, 128, 0, 1)',
  "Offensive" : 'rgba(255, 0, 0, 1)',
  "False" : 'rgba(0, 0, 200, 1)',
  "Confusing" : 'rgba(166, 70, 98, 1)',
  "True" : 'rgba(108,192,37, 1)',
}

class App extends Component {
  constructor(props) {
    super(props);
    // Set our beginning state to be our initial data
    this.state = {
      replies: {},
      root_comments: [],
      replyFormIsOpen: false,
      replyingToID: null,
      post_id: 0
    }
    this.update = this.update.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.handleData = this.handleData.bind(this);
    this.getRepliesForComment = this.getRepliesForComment.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.openReplyForm = this.openReplyForm.bind(this);
    this.closeReplyForm = this.closeReplyForm.bind(this);
    this.api_url = "https://comments-4orum.herokuapp.com/api2/v1/"

    //initialize
    this.initialize();
  }

  /* Given some comment data, sort it into replies and root comments, */
  handleData(data) {
    this.setState({root_comments: [], replies: {}});
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

  /*Given a route in our api, update state with new data*/
  update(route) {
    fetch(this.api_url + route)
    .then(results => {
      return results.json();
    }).then(data => {
      this.handleData(data);
    })
  }

  /*Get thread for the current page*/
  initialize() {
    let parser = document.createElement('a')
    parser.href = window.location.href;
    let post_url = (parser.host + parser.pathname).replace(":","");
    let forum_url = "https://comments-4orum.herokuapp.com";
    let forum_route = forum_url + '/api/post/';
    let url = forum_route + post_url;
    fetch(url).then((response) => {
        return response.json();
      }).then((json) => {
        // when promise fulfilled, perform the rest of our tasks
        let post_path = json.path
        let post_num_string = post_path.replace(/\D/g,'');
        let post_id = parseInt(post_num_string);
        console.log('post_id: ' +  post_id);
        this.setState({post_id: post_id});
        this.update("post/"+this.state.post_id+"/");

        // done
      })
    }
  /*Submit a comment*/
  submitComment(data) {
    fetch('http://4orum.org/api2/v1/comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('authenticated_user:kangaroos'),
      },
      body: JSON.stringify(data)
    }).then(results => {
      console.log(results);
      return results.blob();
    }).then(data => {
      this.update('post/'+this.state.post_id+'/')
    })
  }

  /*Open or close the replyForm for replying to comments*/
  openReplyForm(id) {
    this.setState({replyFormIsOpen: true, replyingToID: id});
  }
  closeReplyForm() {
    this.setState({replyFormIsOpen: false, replyingToID: null});
  }


  /*When our component mounts onto the DOM, get data from our server */
  componentDidMount() {
    console.log("component mounted");
    this.update("post/"+this.state.post_id+"/");
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
        <li className="pure-menu-item">
          <a href="#" className="pure-menu-link">About</a>
        </li>
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
          style={{'float': 'right', 'background-color':sentiments_colors[sentiments[4]], 'color':'white'}}
          onClick={this.closeReplyForm}
        />
        <ReplyForm
          sentiments={sentiments}
          sentiments_colors={sentiments_colors}
          sentiments_map={sentiments_map}
          sentiments_expressions={sentiments_expressions}
          postReply={this.submit}
          parent_id={this.state.replyingToID}
          post_id={this.state.post_id}
          close={this.closeReplyForm}
          submit={this.submitComment}
        />
        </div>
        :
        <div style={{"padding":'2em'}}>
        <Button
          label={"New Comment"}
          style={{'background-color':sentiments_colors[sentiments[7]],'color': 'white'}}
          onClick={()=>{this.openReplyForm(null)}}
        />
        <CommentList
          comments={this.state.root_comments}
          getReplies={this.getRepliesForComment}
          depth={0}
          openReplyForm={this.openReplyForm}
          />
          </div>
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
    <ul style={props.depth==0 ? {paddingLeft:'0px'} : {paddingLeft:'2em'}}>
      {listItems}
    </ul>
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
      <strong>{this.props.author}</strong>: {sentiments_expressions[sentiments[sentiments_tag.indexOf(this.props.tag)]]} {sentiments[sentiments_tag.indexOf(this.props.tag)]}
      </h3>
      </div>
      <div className="comment-body">
      <p className="comment-text">{this.props.text}</p>
      </div>
      <div className="comment-footer">
      <Button
        onClick={()=>this.props.openReplyForm(this.props.id)}
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
