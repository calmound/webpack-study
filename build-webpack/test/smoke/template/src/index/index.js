import { hello } from './hello'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.less'
import IMG from './img/a.jpg'
import { a } from './tree-shaking'

class Search extends React.Component {
  render() {
    return (
      <div>
        Hello,world aaad12
        <img src={IMG} alt="" />
      </div>
    )
  }
}

ReactDOM.render(<Search />, document.getElementById('app'))

document.write(hello())
