const React = require("react");

const today = new Date().toLocaleDateString();

const TodayComponent = React.createClass({
    render: function (){
        return (
            <div>
                <div className="day">TODAY</div>
                <div>{this.props.google}</div>
            </div>
        )
    }
});

module.exports = TodayComponent;
