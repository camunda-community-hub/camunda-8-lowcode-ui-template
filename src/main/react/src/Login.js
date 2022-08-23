import React, { Component } from 'react';
import { Form } from '@bpmn-io/form-js-viewer';
const schema = require('./forms/login.form.json');

class Login extends Component {

  onSubmit = (e, results) => {
    let { data, errors } = results;
    if (Object.keys(errors).length) {
      console.error('Form has errors', errors);
    } else {
      console.log(data);
      this.props.onSubmit(data);
    }
  }

  doSubmit = (e) => {
    //console.log(e.target);
    //console.log(this.state.bpmnForm);
    this.state.bpmnForm.submit();
  }

  componentDidMount() {
    const container = document.querySelector('#form');
    const bpmnForm = new Form({container: container});
    this.setState({'bpmnForm': bpmnForm})
    bpmnForm.on('submit', this.onSubmit);
    bpmnForm.importSchema(schema, this.props.data);
  }

    render() {
        return (
          <div style={{
            height: '100%',
            background: 'url(/img/background.jfif)',
            backgroundSize: 'cover'
          }}>
            <div className={"modal is-active"}>
              {/*<div className={"modal-background"}></div>*/}
              <div className={"modal-card"}>
                <header className={"modal-card-head"}>
                  <p className={"modal-card-title"}><img src="/img/Logo_Black.png" style={{height:'28px'}} height={"28px"} alt={"logo"}/></p>
                </header>
                <section className={"modal-card-body"}>
                  <div id={"form"}></div>
                </section>
                <footer className={"modal-card-foot"}>
                  <button className={"button is-success"} onClick={this.doSubmit}>Sign In</button>
                </footer>
              </div>
            </div>
          </div>
        );
    }
}

export default Login;
