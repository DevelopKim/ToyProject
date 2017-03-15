
const React = require("react");
const EventList = require("./eventList");

class CalendarList extends React.Component {
    render (){
        let scheduleList =  this.props.scheduleList;

        let domList = scheduleList.map(function (item, index){
            return (
                <div className="listUnit" key={item.trimmedDate}>
                    <div className="listUnit-date">
                        {item.day} <span className="date">{item.koreanDate}</span>
                    </div>

                    <EventList eventList={item.eventList} scheduleIndex={index} deleteEvent={this.props.deleteEvent} />
                </div>
            )
        }.bind(this));

        return (
            <div className="listWrapper">
                {domList}
            </div>
        )
    }
}

module.exports = CalendarList;
