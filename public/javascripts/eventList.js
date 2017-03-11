const React = require("react");

class EventList extends React.Component {
    constructor (props){
        super(props);

    }

    deleteItem (index, proxy, event){
        event.preventDefault();
        this.props.deleteEvent(this.props.scheduleIndex, index);
    }

    render (){
        let eventList = this.props.eventList;
        let listItem = eventList.map(function (event, index){
            return (
                <li key={event.id}>
                    {event.summary}
                    <a href="#" className="listUnit-delete" data-index={index} onClick={this.deleteItem.bind(this, index)}>삭제</a>
                </li>
            )
        }.bind(this));

        return (
            <div className="listUnit-item">
                <ul className="list">
                    {listItem}
                </ul>
            </div>
        )
    }
};



module.exports = EventList;
