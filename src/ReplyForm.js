import React, { Component } from 'react';
import PieChart from 'react-chartjs-2';
import './pure-min.css';
import './grids-responsive-min.css';
import './circle-menu.css'

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
      comment: '',
      sentiment: ''
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderChart = this.renderChart.bind(this);
  }

  handleTextChange(event) {
    this.setState({comment: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = {
      'post': '/api2/v1/post/' + this.props.post_id + '/',
      'text': this.state.comment,
      'thoughts': this.props.sentiments_map[this.state.sentiment]
    };
    if (this.props.parent_id) {
      data['parent_comment'] = '/api2/v1/comment/' + this.props.parent_id + '/';
    }

    this.props.submit(data);
    this.props.close();
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
            <div class="pure-u-1 pure-u-md-1-2">
            {this.renderChart()}
            </div>
            <div class="pure-u-1 pure-u-md-1-2">
            <span className="pure-form-message" style={
              {textAlign: "center", margin: "1em"}}>
              <SentimentHeader
                sentiment={this.state.sentiment}
                sentiments_colors={this.props.sentiments_colors}
                sentiments_expressions={this.props.sentiments_expressions}
                />
            </span>
            <textarea className="pure-input-1" style={{height: '100%'}} onChange={this.handleTextChange} required/>
            <button onClick={this.handleSubmit} className="save pure-button pure-input-1">
            Submit comment
            </button>
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
