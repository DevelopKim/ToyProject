# Todo Calendar with Node.js
구글 캘린더와 연동되는 투두리스트.


## 중점적으로 다뤄야 할 것들
- 자바스크립트 모듈 패턴
- ES6
- node.js 기초
- ajax에 익숙해지기


## 시간이 난다면 해보자   
- 깃 브랜치를 하나 만들어서 react.js 로 바꿔보기
- webpack
- 파이어베이스로 로그인, 알림기능 추가하기   


### backlog
https://docs.google.com/spreadsheets/d/1oRVIbWLK-MwApX_wtYIJQj8PHpeQkYhtRmuSprEt5fE/edit#gid=0


### 개발일지 17.02.25
class를 사용해서 구글 캘린더가 ajax로 보내준 일정 데이터를 재가공 했다.  
개별 일정 정보를 담고 있는 오브젝트와 여러개의 개별 일정으로 이루어져 있는 날짜별 오브젝트, 이렇게 두개의 클래스를 만들었다.  
클래스안에서 또다른 클래스를 실행해서 새로운 오브젝트를 만드는 구조이다. (날짜 오브젝트에서 개별 일정 오브젝트를 생성함)  
부모 오브젝트에서 자식 오브젝트의 프라퍼티를 세팅해 주는 구조인데, 변수와 오브젝트의 레퍼런스 관계를 더 자세히 이해하게 됬다.  
반대로 자식 오브젝트에서 부모 오브젝트의 변수를 참조하는 경우도 있다.  
```javascript
appendLi (event){
    var newSchedule = new schedule(event);
    newSchedule.eventGroup = this;

    this.ul.appendChild(newSchedule.li);
    this.eventLength += 1;
}
```

리액트를 노드에서 쓰는 방법을 찾고 있는데, 쉽지 않다.
Universal JavaScript라는 단어를 봤는데 노드에서 실행되는 코드를 브라우저에서도 실행되게 한다는 이야기 같은데 좀 더 찾아봐야 할 것 같다.  
