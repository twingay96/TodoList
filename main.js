//유저가 값을 입력하고 +를 누르면 , 할일이 추가된다
// delete를 누르면 할일이 삭제된다
// check를 누르면  할일이 끝나면서 밑줄이 간다
// 1. check를 클릭하는순간 isComplete를 true로 변경
// 2. isComplete가  true이면 완료된 것으로 간주하고 절취선긋기
// 3. false이면 안끝난 것으로 간주하고 그대로
// 진행중, 완료 탭을 누르면 언더바가 이동한다
// 완료탭은 완료된것만 진행중은 진행중인 것만
let taskInput = document.getElementById("text-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs a");
let horizontalMenus = document.querySelectorAll(".task-tabs a");
let horizontalUnderline = document.getElementById("under-line");
let mode = 'all';

let filterList = [];
let taskList = [];
addButton.addEventListener("click", addTask);

// 언더라인 구현 관련 로직
console.log(tabs);
    // 초기 로딩 시 언더라인 위치 설정
setInitialUnderlinePosition();

function setInitialUnderlinePosition() {
    // 초기에 선택한 메뉴를 여기에서 설정
    // 예를 들어, 첫 번째 메뉴를 선택
    activeMenu = horizontalMenus[0];
  
    // 언더라인 초기 위치 설정함수 호출
    firstUpdateHorizontalUnderline();
  }

    // 언더라인 초기위치 설정함수 => 애니메이션 효과 적용X
function firstUpdateHorizontalUnderline(){
    horizontalUnderline.style.transition = "none";
    horizontalUnderline.style.left = activeMenu.offsetLeft + "px";
    horizontalUnderline.style.width = activeMenu.offsetWidth + "px";
    horizontalUnderline.style.top =
      activeMenu.offsetTop + activeMenu.offsetHeight + "px";

}


window.addEventListener("resize", () => {
  // resize 이벤트 발생 시 애니메이션 효과 제거
  horizontalUnderline.style.transition = "none";
  updateHorizontalUnderline();
});

horizontalMenus.forEach((menu) => {
  menu.addEventListener("click", (e) => {
    horizontalIndicator(e);
  });
});


    // 메뉴항목 클릭시에만 호출할 함수 
function updateHorizontalUnderline() {
    if (activeMenu) {
      if (activeMenu.classList.contains("active")) {
        // activeMenu의 경우 애니메이션 효과 적용
        horizontalUnderline.style.transition = "0.5s";
      } 
      // 이벤트리스너 resize로 호출된경우에는 activeMenu.classList에 active속성이 없으므로 애니메이션 효과적용X
      horizontalUnderline.style.left = activeMenu.offsetLeft + "px";
      horizontalUnderline.style.width = activeMenu.offsetWidth + "px";
      horizontalUnderline.style.top =
        activeMenu.offsetTop + activeMenu.offsetHeight + "px";
  
      // 브라우저가 리플로우되지 않도록 다른 속성 변경
      horizontalUnderline.style.transform = "translateZ(0)";
    }
    // 언더라인 이동완료후에는 active속성제거
    activeMenu.classList.remove("active");
  }
  
  function horizontalIndicator(e) {
    activeMenu = e.currentTarget; // 선택한 메뉴 정보 업데이트
    activeMenu.classList.add("active");
    updateHorizontalUnderline(); //언더라인 위치 옮기는 함수호출
  
  }

// 여기서부터 모두, 진행중, 완료 구분 로직 
for(let i=0; i<tabs.length;i++){
    tabs[i].addEventListener("click",function(event){filter(event)})
}
function filter(event){
    filterList= [];
    console.log(" event.target.id:",event.target.id);
    mode = event.target.id;
    console.log("filter클릭됨",event.target.id);
    if(mode == 'all'){
        console.log("all 필터 조건문 동작");
        console.log("taskList:", taskList);
        render();
    }else if(mode =='ongoing'){
        console.log("ongoing 필터 조건문 동작")
        for(let i=0; i<taskList.length; i++){
            if(taskList[i].isComplete == false  ){
                filterList.push(taskList[i]);
            }
        }
        render();
    }else if(mode=="done"){
        console.log("done 필터 조건문 동작")
        for(let i=0; i<taskList.length; i++){
            if(taskList[i].isComplete == true ){
                filterList.push(taskList[i]);
            }
        }
        render();
    }
    console.log("filterList:",filterList);
}

function addTask() {
  let task = {
    //객체 선언: 여러개의 정보를 포함시키고 싶을 경우사용
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  taskList.push(task);
  console.log(taskList);
  render();
}
function render() {
  let resultHTML = "";
  let list = [];
  if (mode =="all"){
    list = taskList;
  }else if(mode =="ongoing" || mode =="done"){
    list = filterList;
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML += `<div class="task">
            <div class="task-done">${list[i].taskContent}</div>
            <div>
                <button onclick="toggleComplete('${list[i].id}')">check</button>
                <button onclick="deleteTask('${list[i].id}')">delete</button>
            </div>
        </div>`;
    } else {
      resultHTML += `<div class="task">
        <div>${list[i].taskContent}</div>
        <div>
            <button onclick="toggleComplete('${list[i].id}')">check</button>
            <button onclick="deleteTask('${list[i].id}')">delete</button>
        </div>
    </div>`;
    }

    console.log(resultHTML);
  }
  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  //console.log("check됬음", id);
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render();
  console.log(taskList);
}
function randomIDGenerate() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
function deleteTask(id){
    console.log("삭제하다",id)
    for(let i=0; i<taskList.length; i++){
        if(taskList[i].id==id){
            taskList.splice(i,1);
            filterList.splice(i,1);
            break;
        }
    }
    console.log(taskList)
    render();
    
}
