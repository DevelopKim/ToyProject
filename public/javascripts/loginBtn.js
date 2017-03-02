const React = require("react");

class LoginBtn extends React.Component {

    render (){
        return (
            <div>
                <button id="authorize-button" className="button">로그인</button>
                <button id="signout-button" className="button active" onClick={this.props.googleApi.signOut}>로그아웃</button>
            </div>
        )
    }

    test (){

    }

}

module.exports = LoginBtn;
