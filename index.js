import UrlPattern from 'url-pattern';
import React, { Component } from 'react-lite';

const routes = [];
export class HashRouter extends Component {
  constructor(props) {
    super(props);
    this.routes = routes;
    this.routes.push(this);
    this.broadcastHashChange = this.broadcastHashChange.bind(this);
    if (!window.location.hash.includes("#")) {
      window.location.replace('/#/');
    }
    window.addEventListener('hashchange', this.broadcastHashChange);
    this.state = {
      urlPath: "/"
    }
    
  }
  onHashChange(urlPath) {
    this.setState({ urlPath });
  }

  broadcastHashChange() {
    const urlPath = window.location.hash.split('#')[1];
    this.routes.forEach(route => route.onHashChange(urlPath));
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export class Route extends Component {
  constructor(props) {
    super(props);
    routes.push(this);
    this.pattern = new UrlPattern(this.props.path);
    this.state = { urlPath: window.location.hash.split('#')[1] };
    this.onHashChange = this.onHashChange.bind(this);
    this.history = {
      push: path => window.location.replace(`/#${path}`)
    }
  }

  onHashChange(urlPath) {
    this.setState({ urlPath });
  }

  render() {
    const Comp = this.props.component;
    const params = this.pattern.match(this.state.urlPath);
    if (!params) return <span />;
    if (this.props.exact && this.state.urlPath !== this.props.path) return <span />;
    const match = { params };
    return <Comp match={match} history={this.history} />;
  }
}

export const Link = ({ to, children }) => <a onClick={() => window.location.replace(`/#${to}`)}>{children}</a>

export const Redirect = ({ to }) => {
  window.location.replace(`/#${to}`);
  return <div />;
}