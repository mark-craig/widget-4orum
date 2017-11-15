import React, { Component } from 'react';
import PieChart from 'react-chartjs-2';
import './pure-min.css';
import './grids-responsive-min.css';
import './circle-menu.css'

class ReplyForm extends React.Component {
  /*
  For its props, ReplyForm takes in a list of 8 sentiments (strings) and a
  dictionary mapping those sentiments to colors.
  */
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      sentiment: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderChart = this.renderChart.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
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
          console.log(sentiment);
        }
      },
      responsive: true,
      legend: {
        display: false
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
      <div>
      <SentimentHeader
        sentiment={this.state.sentiment}
        sentiments_colors={this.props.sentiments_colors}
        />
      <form className="pure-form pure-g" onSubmit={this.handleSubmit}>
        <div className="pure-u-1 pure-u-md-1-2">
            {this.renderChart()}
            <span className="pure-form-message" style={
              {textAlign: "center", margin: "1em"}}>
              Select a reaction from the wheel above.
            </span>
          </div>
        <div className="pure-u-1 pure-u-md-1-2">
          <textarea className="pure-input-1" style={{height: '100%'}} required/>
          <button type="submit" value="Submit" className="save pure-button pure-input-1">
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
      backgroundColor: props.sentiment ? props.sentiments_colors[props.sentiment]: "auto",
      color: 'white',
      padding: '0.25em'
      }}>{props.sentiment
      ? " " + props.sentiment
      : "..."}
      </strong>
       </h2>
  )
}

export default ReplyForm;
