import React, { Component } from 'react';
import PieChart from 'react-chartjs-2';
import ReactMde, { ReactMdeCommands } from 'react-mde';
import widgetStyles from './widget-styles.js'



class ReplyForm extends React.Component {
  /*
  For its props, ReplyForm takes in:
  * sentiments: a list of 8 sentiments (strings)
  * sentiments_colors: a dictionary mapping those sentiments to colors.
  * sentiments_map: mapping of sentiments to their two character DB representation.
  * sentiments_expressions: mapping of sentences corresponding to sentiments
  * parent_id: the id of the comment that is being replied to
  * post_id: the id of the post that the comment thread is on
  * postReply(data): a function that will submit data to the api
  */
  constructor(props) {
    super(props);
    this.state = {
      comment: {text: '', selection: null},
      sentiment: null,
      error_message: null,
      attempting_login: false,
      attempting_to_submit: false
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  handleTextChange(value) {
    this.setState({comment: value});
  }

  componentDidUpdate() {
    if (this.props.logged_in && this.state.attempting_to_submit) {
      // Finish trying to send the comment
      let dummy_event = {preventDefault: ()=>null}
      this.handleSubmit(dummy_event);
    }
  }

  validateForm(data) {
    if (!data.post) {
      // not sure why this would be the case, but do not allow
      this.setState({error_message: "An unknown error occurred. Please try again later.",
                      attempting_to_submit: false});
      return false;
    }
    if (!data.text) {
      // we need text in the comment
      this.setState({error_message: "Please write a comment before submitting.",
                      attempting_to_submit: false});
      return false;
    } else if (data.text.trim() == "") {
      // we need text in the comment
      this.setState({error_message: "Please write a comment before submitting.",
                      attempting_to_submit: false});
      return false;
    }
    if (data.parent_comment && !data.thoughts) {
      // we need a sentiment if there is a parent comment
      this.setState({error_message: "Please choose a sentiment since you are replying to another comment",
                      attempting_to_submit: false});
      return false;
    }
    if (!this.props.logged_in) {
      this.setState({error_message: "Please log in before submitting",
                      attempting_to_submit: true});
      this.props.openLoginForm();
      return false;
    }
    this.setState({error_message: null});
    return true;
  }

  handleSubmit(event) {
    event.preventDefault();
    let th = null;
    if (this.state.sentiment) {
      th = this.props.sentiments_map[this.state.sentiment];
    }
    let data = {
      'post': '/api2/v1/post/' + this.props.post_id + '/',
      'text': this.state.comment.text,
      'thoughts': th
    };
    if (this.props.parent_id) {
      data['parent_comment'] = '/api2/v1/comment/' + this.props.parent_id + '/';
    }
    if (this.validateForm(data)) {
      this.setState({error_message: null});
      this.props.submit(data);
      this.props.close();
    }
  }

  renderChart() {
    const chartData = {
        labels: this.props.sentiments,
        datasets: [{
            data: [1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: [
                this.props.sentiments_colors[this.props.sentiments[0]],
                this.props.sentiments_colors[this.props.sentiments[1]],
                this.props.sentiments_colors[this.props.sentiments[2]],
                this.props.sentiments_colors[this.props.sentiments[3]],
                this.props.sentiments_colors[this.props.sentiments[4]],
                this.props.sentiments_colors[this.props.sentiments[5]],
                this.props.sentiments_colors[this.props.sentiments[6]],
                this.props.sentiments_colors[this.props.sentiments[7]]
            ],
        }],
      }
    const options = {
      onClick: (event, elems) => {
        if (elems[0]) {
          var sentiment = chartData.labels[elems[0]._index];
          this.setState({sentiment : sentiment});
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            return chartData.labels[tooltipItem.index];
          }
        }
      },
      responsive: true,
      maintainAspectRation: false,
      legend: {
        display: false,
      }
    }
    return (
      <PieChart
        data={chartData}
        options={options}
        />
      )
    }

  render() {
    return (
      <form className="pure-form pure-g">
            {this.state.error_message
              ? <div className={"pure-u-1 " + widgetStyles["alert-error"]}>{this.state.error_message}</div>
              : <div/>
            }
            <div className="pure-u-1 pure-u-md-1-2">
            {this.props.parent_id
                ? this.renderChart()
                : <div/>
            }
            {this.props.parent_id
              ? <span className={"pure-form-message " + widgetStyles["sentiment-message"]}>
                <SentimentHeader
                  sentiment={this.state.sentiment}
                  sentiments_colors={this.props.sentiments_colors}
                  sentiments_expressions={this.props.sentiments_expressions}
                  />
                  </span>
              : <span/>
              }
              </div>
              <div className={"pure-u-1 " +(this.props.parent_id ? "pure-u-md-1-2" : "")}>
              <ReactMde
              textAreaProps={{
                  id: 'ta1',
                  name: 'ta1',
                }}
                value={this.state.comment}
                onChange={this.handleTextChange}
                commands={ReactMdeCommands.getDefaultCommands()}
                />
              <button onClick={this.handleSubmit} className="pure-button pure-input-1">Submit comment</button>
              </div>
            </form>

    );
  }
}

class SentimentHeader extends React.Component {
  render() {
    return (
      <span style={{fontSize: "larger"}}>
      {this.props.sentiment
        ? this.props.sentiments_expressions[this.props.sentiment]
        : "Choose a reaction from the wheel" }
        <strong style={{
          color: this.props.sentiment ? this.props.sentiments_colors[this.props.sentiment]: "lightgray",
          }}>{this.props.sentiment
              ? this.props.sentiment
              : "..."}
        </strong>
      </span>
    )
  }
}

export default ReplyForm;
