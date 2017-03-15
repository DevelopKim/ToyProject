const React = require("react");
const LoginBtn = require("./LoginBtn");

class Header extends React.Component {
    constructor (props){
        super(props);
    }

    render (){
        let date = helper.getKoreanDate(new Date());

        return (
            <header className="header">
                <MenuIcon />
                <h1 className="header-title">
                    <div className="day">TODAY</div>
                    <div>{date}</div>
                </h1>
                <div className="header-right">
                    <LoginBtn googleApi={this.props.googleApi} isSignIn={this.props.isSignIn} getCalendarFunc={this.props.getCalendarFunc} />
                </div>
            </header>
        )
    }
}

function MenuIcon (){
    return (
        <a href="#" className="header-menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
                <path d="M0 0v1h8v-1h-8zm0 2.97v1h8v-1h-8zm0 3v1h8v-1h-8z" transform="translate(0 1)" />
            </svg>
        </a>
    )
}

module.exports = Header;
