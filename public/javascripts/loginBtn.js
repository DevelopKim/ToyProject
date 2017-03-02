const React = require("react");

class LoginBtn extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            signed: this.props.isSignIn ? 1 : 0,
            text: ["로그인", "로그아웃"],
            eventHandler: [this.signIn, this.signOut]
        };
    }

    signIn (){
        this.props.googleApi.signIn();
        this.props.changeState(1);

        // 로그인 state를 바꿔준다.
        this.setState({
            signed: 1
        });
    }

    signOut (){
        this.props.googleApi.signOut();
        this.props.changeState(0);

        // 로그인 state를 바꿔준다.
        this.setState({
            signed: 0
        });
    }

    render (){
        let index = this.state.signed;

        return (
            <button id="authorize-button" className="button" onClick={this.state.eventHandler[index].bind(this)}>
                {this.state.text[index]}
            </button>
        )
    }
}

module.exports = LoginBtn;
