const React = require("react");
const Header = require("./header");
const CalendarList = require("./calendar");

class App extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            login: 0
        }
    }

    changeState (value){
        this.setState({
            login: value
        });
    }

    render (){
        return (
            <div>
                <Header googleApi = {this.props.googleApi} isSignIn = {this.props.isSignIn} changeState = {this.changeState.bind(this)} />
                <div className="mainContents">
                    <CalendarList />
                </div>
            </div>
        )
    }
}

module.exports = App;
