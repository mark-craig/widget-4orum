import React, { Component } from 'react';
import ReplyForm from './ReplyForm.js';
import LoginForm from './LoginForm.js';
import logo from './4orum.svg';
import { Markdown } from 'react-showdown';
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
      replies: null,
      all_comments: null,
      root_comments: null,
      replyFormIsOpen: false,
      replyingToID: null,
      replyingToName: null,
      replyingToText: null,
      replyingToSentiment: null,
      replyingToRoot: null,
      post_id: 0,
      loginFormIsOpen: false,
      logged_in: false,
      username: null,
      password: null,
      in_thread: false
    }
    this.update = this.update.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.handleData = this.handleData.bind(this);
    this.getRepliesForComment = this.getRepliesForComment.bind(this);
    this.openReplyForm = this.openReplyForm.bind(this);
    this.closeReplyForm = this.closeReplyForm.bind(this);
    this.openLoginForm = this.openLoginForm.bind(this);
    this.closeLoginForm = this.closeLoginForm.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
    this.storeLogin = this.storeLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.filterComments = this.filterComments.bind(this);
    this.returnToMain = this.returnToMain.bind(this);

    this.api_url = "https://comments-4orum.herokuapp.com/api2/v1/"

    //initialize
    this.initialize();
  }

  /* Given some comment data, sort it into replies and root comments, */
  handleData(data) {
    this.setState({root_comments: [], replies: {}});
    if (data.comments) {
      if (!this.state.all_comments) {
        this.setState({all_comments: data.comments});
      }
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
      if (results.status == 200) {
        return results.json();
      }}).then(data => {
        if(data){
          this.handleData(data);
        }
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

  /*Filters comments to only view children of the given id*/
  filterComments(parent_id) {
    this.setState({root_comments: null});
    let new_root_comments = this.state.all_comments.filter(comment => comment.id==parent_id);
    this.setState({root_comments: new_root_comments, in_thread: true})
  }

  returnToMain() {
    this.setState({in_thread: false, root_comments: null, all_comments: null, replies: null});
    this.update("post/"+this.state.post_id+"/");
  }
  /*Submit a comment*/
  submitComment(data) {
    fetch('https://4orum.org/api2/v1/comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(this.state.username+':'+this.state.password),
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
  openReplyForm(id, name, sentiment, text, hideHeader) {
    this.setState({replyFormIsOpen: true,
                  replyingToID: id,
                  replyingToName: name,
                  replyingToSentiment: sentiment,
                  replyingToText: text,
                  replyingToRoot: hideHeader});
  }
  closeReplyForm() {
    this.setState({replyFormIsOpen: false,
                  replyingToID: null,
                  replyingToName: null,
                  replyingToSentiment: null,
                  replyingToText: null,
                  replyingToRoot: null});
  }

  /*Open or close the Login/Register from for logging users in*/

  openLoginForm() {
    this.setState({loginFormIsOpen: true});
  }
  closeLoginForm() {
    this.setState({loginFormIsOpen: false});
  }

  verifyLogin(username, password) {
    /*Implement soon*/
    return true;
  }
  storeLogin(username, password) {
    this.setState({username: username, password: password, logged_in: true});
  }
  logout() {
    this.setState({username: null, password: null, logged_in: false});
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

  render() {
    return (
      <div className="App">
      <div className="pure-menu pure-menu-horizontal pure-menu-scrollable">
      <a href="https://4orum.org" className="pure-menu-heading pure-menu-link">
        4<img className="logo" src={logo} alt="o"/>rum
      </a>
      {!this.state.logged_in
        ? <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <a href="#" onClick={(event)=>this.openLoginForm()}
                className="pure-menu-link">Login</a>
            </li>
          </ul>
          :
          <ul className="pure-menu-list">
           <li className="pure-menu-item pure-menu-disabled">Logged in as {this.state.username}</li>
            <li className="pure-menu-item">
              <a href="#" onClick={(event)=>this.logout()}
                className="pure-menu-link">Logout</a>
            </li>
          </ul>
        }
      </div>
      <LoginForm
        isOpen={this.state.loginFormIsOpen}
        close={this.closeLoginForm}
        login={this.verifyLogin}
        store={this.storeLogin}
      />
      <div style={{padding: "1em"}}>
      { this.state.replyFormIsOpen
        ?
        <div className="pure-g">
        <div className="pure-u-1">
        <Button
          label={"Cancel"}
          style={{backgroundColor:sentiments_colors[sentiments[4]]}}
          className={"cancel-button nav-button"}
          onClick={this.closeReplyForm}
        />
        </div>
        <div className="pure-u-1">
        { this.state.replyingToID
          ?
          <div>
          <h3 className="pure-form-message">Replying to comment</h3>
          <Comment
            author={this.state.replyingToName}
            tag={this.state.replyingToSentiment}
            text={this.state.replyingToText}
            id={this.state.replyingToID}
            key={this.state.replyingToID}
            hideHeader={this.state.replyingToRoot}
          />
          </div>
          :
          <div className="blank"/>
        }
        </div>
        <div className="pure-u-1">
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
          openLoginForm={this.openLoginForm}
          logged_in={this.state.logged_in}
        />
        </div>
        </div>
        :
        <div class="pure-g">
        <div className="pure-u-1">
        {!this.state.in_thread
          ? <Button
            label={"New Comment"}
            className={"pure-button-primary nav-button"}
            onClick={()=>this.openReplyForm(null)}
            />
          : <Button
            label={"< Return to Main Thread"}
            className={"cancel-button nav-button"}
            onClick={()=>this.returnToMain()}
            />
        }

        </div>
        <div className="pure-u-1">
        { this.state.root_comments
          ? <CommentList
            comments={this.state.root_comments}
            getReplies={this.getRepliesForComment}
            depth={0}
            openReplyForm={this.openReplyForm}
            hideHeaders={true}
            continueThread={this.filterComments}
            />
          : <img className="loading" src={logo}/>
        }
        </div>
        </div>
      }
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
  let hideHeader=false;
  if (props.hideHeaders) {
    hideHeader=true;
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
      hideHeader={hideHeader}
      continueThread={props.continueThread}
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
    if (this.props.openReplyForm) {
      const replies = this.props.getReplies(this.props.id);
      if (replies) {
        if (this.props.depth < 4) {
          return (
            <CommentList
              comments={replies}
              getReplies={this.props.getReplies}
              depth={this.props.depth}
              openReplyForm={this.props.openReplyForm}
              continueThread={this.props.continueThread}
              />
          );
        } else {
          return (
            <div className="continue-thread">
            <Button
              onClick={(event)=>this.props.continueThread(this.props.id)}
              label={"Continue this thread -->"}
              className={"continue-thread-button pure-button-primary"}
              />
            </div>
            )
          }
        }
      }
    }


  render() {
    return (
        <div className="comment-group">
        <div className="comment">
        {!this.props.hideHeader
          ? <div className="comment-header"
              style={{backgroundColor: sentiments_colors[sentiments[sentiments_tag.indexOf(this.props.tag)]]}}>
              <h3> <strong>{this.props.author}</strong>:
                  {" " + sentiments_expressions[sentiments[sentiments_tag.indexOf(this.props.tag)]]}
                  {sentiments[sentiments_tag.indexOf(this.props.tag)]}
              </h3>
            </div>
          : <div className="comment-header no-sentiment">
              <h3>
                <strong>{this.props.author}</strong> says:
              </h3>
            </div>
        }
        <div className="comment-body">
        <Markdown markup={this.props.text}/>
        </div>
        <div className="comment-footer">
        {this.props.openReplyForm
        ? <Button
            className="larger-button"
            onClick={()=>this.props.openReplyForm(this.props.id,
                                                  this.props.author,
                                                  this.props.tag,
                                                  this.props.text,
                                                  this.props.hideHeader)}
          label={"Reply"}
        />
        :
        <div className="blank"/>
      }
        </div>
        </div>
        {this.replyThread()}
        </div>
      )
  }
}

/*
Button takes in a label, and a function that corresponds to onClick.
*/
function Button(props) {
  return (
    <button type="button" style={props.style} className={"pure-button " + props.className} onClick={props.onClick}>
    {props.label}
    </button>
  )
}

export default App;
