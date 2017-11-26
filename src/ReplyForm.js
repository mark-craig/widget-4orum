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
      'parent_comment': '/api2/v1/comment/' + this.props.parent_id + '/',
      'text': this.state.comment,
      'thoughts': this.props.sentiments_map[this.state.sentiment]
    };
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
      legend: {
        display: true,
        position: 'left'
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
      <div style={{'padding':'2em'}}>
      <SentimentHeader
        sentiment={this.state.sentiment}
        sentiments_colors={this.props.sentiments_colors}
        />
      <form className="pure-form pure-g">
        <div className="pure-u-1 pure-u-md-1-2">
            {this.renderChart()}
            <span className="pure-form-message" style={
              {textAlign: "center", margin: "1em"}}>
              Select a reaction from the wheel above.
            </span>
          </div>
        <div className="pure-u-1 pure-u-md-1-2">
          <textarea className="pure-input-1" style={{height: '100%'}} onChange={this.handleTextChange} required/>
        <button onClick={this.handleSubmit} className="save pure-button pure-input-1">
          Submit comment
        </button>
        </div>

      </form>

      </div>
    );
  }
}

function SentimentHeader(props) {
  return (
    <h2>
    I think this is <strong style={{
      backgroundColor: props.sentiment ? props.sentiments_colors[props.sentiment]: "lightgray",
      color: 'white',
      padding: '0.25em'
      }}>{props.sentiment
      ? props.sentiment
      : "..."}
      </strong>
    </h2>
  )
}

export default ReplyForm;
