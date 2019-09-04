import React from 'react'
import ReactDOM from 'react-dom'

class Search extends React.Component {
  constructor() {
    super(...arguments)

    this.state = {
      Text: null
    }
  }
  loadComponent() {
    import('./text.js').then(Text => {
      this.setState({
        Text: Text.default
      })
    })
  }
  render() {
    const { Text } = this.state
    return (
      <div onClick={this.loadComponent.bind(this)}>
        Hello,world aaad12
        {Text ? <Text /> : null}
      </div>
    )
  }
}

ReactDOM.render(<Search />, document.getElementById('app'))
