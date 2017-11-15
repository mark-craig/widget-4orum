import React, { Component } from 'react';
import './pure-min.css';
import './grids-responsive-min.css';
import './circle-menu.css'

class ReplyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form className="pure-form pure-g" onSubmit={this.handleSubmit}>
        <div className="pure-u-1 pure-u-md-1-2">
          <nav className="circle-menu">
            <div className="center"></div>
            <ul id="id_thoughts">
                <li for="id_thoughts_1" title="Interesting">
                  <input id="id_thoughts_1" name="thoughts" type="radio" value="IN" required />
                  <label for="id_thoughts_1">
                  </label>
                </li>
                <li>
                  <label for="id_thoughts_0" title="Enlightening">
                    <input id="id_thoughts_0" name="thoughts" type="radio" value="EN" required />
                  </label>
                </li>
                <li>
                  <label for="id_thoughts_7" title="Agreeable">
                    <input id="id_thoughts_7" name="thoughts" type="radio" value="AG" required />
                  </label>
                </li>
                <li>
                  <label for="id_thoughts_6" title="Confusing">
                    <input id="id_thoughts_6" name="thoughts" type="radio" value="CF" required />
                  </label>
                </li>
                <li>
                  <label for="id_thoughts_5" title="Disagreeable">
                    <input id="id_thoughts_5" name="thoughts" type="radio" value="DA" required />
                  </label>
                </li>
                <li>
                  <label for="id_thoughts_4" title="Malicious">
                    <input id="id_thoughts_4" name="thoughts" type="radio" value="MA" required />
                  </label>
                </li>
                <li>
                  <label for="id_thoughts_3" title="Inflammatory">
                    <input id="id_thoughts_3" name="thoughts" type="radio" value="IF" required />
                  </label>
                </li>
                <li>
                  <label for="id_thoughts_2" title="Controversial">
                    <input id="id_thoughts_2" name="thoughts" type="radio" value="CT" required />
                  </label>
                </li>
              </ul>
            </nav>
            <label>Select a reaction above</label>
          </div>
        <div className="pure-u-1 pure-u-md-1-2">
          <textarea className="pure-input-1" style={{height: '100%'}} required/>
          <button type="submit" value="Submit" className="save pure-button pure-input-1">
            Submit comment
          </button>
        </div>
      </form>
    );
  }
}
export default ReplyForm;
