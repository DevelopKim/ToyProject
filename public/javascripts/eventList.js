const React = require("react");

class EventList extends React.Component {
    constructor (props){
        super(props);

        // 리스트가 여러개 있으니, 버튼도 여러개 있을 수 있다.
        // click 이벤트 핸들러에서 index를 받아와서 해당 리스트의 버튼을 가져온다.
        this.button = [];
    }

    deleteItem (index, proxy, event){
        this.button[index].innerHTML = "로딩중";
        this.props.deleteEvent(this.props.scheduleIndex, index);
    }

    render (){
        let eventList = this.props.eventList;

        let listItem = eventList.map(function (event, index){
            return (
                <li key={event.id}>
                    {event.summary}
                    <span className="listUnit-delete" data-index={index} onClick={this.deleteItem.bind(this, index)} ref={(button) => {this.button.push(button)}}>
                        삭제
                    </span>
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
