
// 메뉴 토글 스크립트
// 메뉴가 열렸는지 상태와 메뉴 토글 함수를 반환한다.
// {
//  gnbIsOpen: ,
//  menuToggle:
// }

var todoMenu = (function(){
    var gnb = document.querySelector(".gnb");
    var menuBtn = document.querySelector(".header-menu");

    var option = {
        gnbIsOpen: false,
        menuToggle: function (event){
            if (this.gnbIsOpen){
                gnb.classList.remove("open");
                this.gnbIsOpen = false;
                return false;
            }
            gnb.classList.add("open");
            this.gnbIsOpen = true;
        }
    };

    menuBtn.addEventListener("click", option.menuToggle.bind(option));

    return option;
})();
