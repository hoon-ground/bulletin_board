let target = document.querySelector("#dynamic");

//커서 깜빡임 효과
function blink(){
    target.classList.toggle("active");
}
setInterval(blink, 500);

//문자열 나열
function randomString(){
    let stringArr = ["Do! and then regret.", "Positive power can change my life.", "Better tomorrow than yesterday."];
    let selectString = stringArr[Math.floor(Math.random() * stringArr.length)];
    let selectStringArr = selectString.split("");

    return selectStringArr;
}

function resetTyping(){
    target.textContent = "";
    dynamic(randomString());
}

//텍스트 출력함수
function dynamic(randomArr){
    if(randomArr.length > 0){
        target.textContent += randomArr.shift();
        setTimeout(function(){
            dynamic(randomArr);
        }, 80);
    }else{
        setTimeout(resetTyping, 1000);
    }
}

dynamic(randomString());

//target section으로 이동
function scrollToSection(){
    document.getElementById("target").scrollIntoView({ behavior: "smooth"});
}

//header 영역 동적 스타일 적용
const headerE1 = document.querySelector("header");
window.addEventListener('scroll', function(){
    this.requestAnimationFrame(scrollCheck);
});

function scrollCheck(){
    let browseScrollY = window.scrollY ? window.scrollY : window.pageYOffset;
    if(browseScrollY > 0){ //if문을 이용해 active클래스를 추가하거나 삭제.
        headerE1.classList.add("active");
    }else{
        headerE1.classList.remove("active");
    }
}

//부드러운 이동 animation 구현
const animationMove = function(selector){
    const targetE1 = document.querySelector(selector);
    const browserScrollY = window.pageYOffset;
    const targetScrollY = targetE1.getBoundingClientRect().top + browserScrollY;
    window.scrollTo({ top:targetScrollY, behavior:'smooth'});
};

//스크롤 이벤트 연결
const scrollMoveE1 = document.querySelectorAll("[data-animation-scroll='true']");
for(let i = 0; i <scrollMoveE1.length; i++){
    scrollMoveE1[i].addEventListener('click', function(e){
        const target = this.dataset.target;
        animationMove(target);
    });
}

//타임스탬프 기록 생성
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); //YY
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); //MM
    const day = now.getDate().toString().padStart(2, "0"); //DD
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString(); //12시간으로 표시

    return `${year}.${month}.${day}. ${ampm} ${formattedHours}:${minutes}`;
}

const postsPerPage = 5;
let currentPage = 1;

function renderPage(){
    const allPosts = document.querySelectorAll("#my-post .post-item");
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    //모든 게시물 숨기기
    allPosts.forEach((post, index) => {
        if (Math.ceil((index + 1) / postsPerPage) === currentPage) {
            post.style.display = "block"; // 현재 페이지 게시물만 표시
        } else {
            post.style.display = "none";
        }
    });

    // 현재 페이지가 총 페이지 수를 초과하면 마지막 페이지로 이동
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // 기존 버튼 제거

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.onclick = function () {
            currentPage = i;
            renderPage();
        };
        if (i === currentPage) {
            button.classList.add("active"); // 현재 페이지 버튼 강조
        } else {
            button.classList.remove("active");
        }
        paginationContainer.appendChild(button);
    }
}

//Create
function setItem(){
    const itemInput = document.getElementById("create");
    const content = itemInput.value.trim();

    if (content === ""){
        alert("Please enter your message.")
        return;
    }
    const newPost = document.createElement("li");
    newPost.classList.add("post-item"); //post-item 클래스 추가.

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.readOnly = true;

    //타임스탬프 표시
    const timestamp = document.createElement("div"); //타임스탬프를 담을 div
    timestamp.classList.add("timestamp"); //timestamp 클래스 추가.
    timestamp.innerText = `Created: ${getTimestamp()}`; //방명록 생성 시 타임스탬프
    
    //Update
    const updateButton = document.createElement("button");
    updateButton.innerText = "Edit";
    updateButton.onclick = function(){
        if(textarea.readOnly){
            textarea.readOnly = false;
            updateButton.innerText = "Save";
        } else{
            textarea.readOnly = true;
            updateButton.innerText = "Edit";

             // Update 타임스탬프
             const updateTime = getTimestamp();
             timestamp.innerText = `Updated: ${updateTime}`; //수정 시 타임스탬프 업데이트
        }
    };

    //Delete
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function(){
        newPost.remove();

        // 삭제 후 페이지 유효성 확인
        const totalPosts = document.querySelectorAll("#my-post .post-item").length;
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        renderPage();
    }

    const buttonbox = document.createElement("div");
    buttonbox.classList.add("buttonboxes");
    buttonbox.appendChild(updateButton);
    buttonbox.appendChild(deleteButton);

    newPost.appendChild(textarea);
    newPost.appendChild(timestamp);
    newPost.appendChild(buttonbox);
    //위 요소들은 형제요소가 된다.

    const postList = document.getElementById("my-post");
    postList.appendChild(newPost);

     // 새로운 게시물 추가 후 마지막 페이지로 이동
     currentPage = Math.ceil(postList.children.length / postsPerPage);

    itemInput.value = "";

    renderPage(); // 새 게시물 추가 후 페이지 다시 렌더링

    newPost.scrollIntoView({ behavior: "smooth", block: "end" });
}

// 초기 페이지 렌더링
renderPage();

// HTML에서 페이징 버튼 컨테이너 추가
const paginationContainer = document.createElement("div");
paginationContainer.id = "pagination";
document.getElementById("postlist").appendChild(paginationContainer);

