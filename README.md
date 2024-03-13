# master-class fe-newsstand

## index.js
 - [X] header는 처음 랜더링 시에만 업데이트 해주면 된다. List,Grid모드로 main 뷰만 바꿔주는 코드를 index.js에서 구현하고 나머지는 각 component 파일에서 기능을 구현한다
 - [X] 구독한 언론사와 grid, rist 뷰를 boolean 으로 구분해 화면을 바꿔준다.
```
function NewsStand() {
    const status = {subscribeStatus: false, listMode: false} // 블리언 값으로 현재 View 결정
    const activateMode = (className) => {} // grid, list 이미지를 바꿔주고 활성화된 view의 display를 flex로 바꿔준다.

    const setEventHandler = () => {}; // 이벤트리스너를 모아두는 함수()

    const isDisplayVisible = () => {} grid, list View를 결정해 화면에 그려준다.

    const main = async() => {
        dateView.renderCurrentDate() // 현재 날짜 랜더
        await topNewsForm.initData() // json 데이터 파싱하는 것을 기다린다.
        topNewsForm.renderTopNews() // 최신 뉴스 랜더
        topNewsForm.rollingNews() // 최신 뉴스를 롤링한다.
        activateMode(INITIAL_VIEW) // 그리드 보기를 기본상태로 한다.
    };
    
    setEventHandler();
    return { main };
}
```

## GridViewForm.js
### 언론사별 이름과 링크를 파싱해 html을 만들어 화면에 그려주는 역할
- [X] 크롤링한 데이터를 파싱해 섞어주어 랜덤한 언론사를 보여준다.
- [X] 크롤링한 데이터를 24개씩 잘라 2차원 배열로 만든다. 페이지를 넘겼을 때 index 값으로 페이지를 보여주기 위함.
- [X] 현재 페이지 숫자를 넘겨줘 2차원 배열에서 언론사들을 가져오고 html을 만들어 화면에 그려준다.
- [X] 화살표 방향에 따라 페이지를 넘길때 let currenPageNum = 0; 값을 업데이트해 다시 그려준다.
- [X] let currenPageNum = 0; 값이 0이거나 3일때 각 방향의 화살표를 지워준다.
- [ ] 화살표를 지울때 이벤트 리스너를 제거해 누수 효과를 방지한다.
- [ ] 구독한 언론사를 보여주는 기능도 여기서 구현예정
```
function GridViewForm () {
    let currenPageNum = 0; // 페이지를 넘겼을 때 업데이트해 companydata의 몇번째 인덱스를 그려줄지 확인하는 변수
    const companyData = []; // json 데이터를 파싱한 값을 2차원 배열로 만들어 넣어줄 변수

    const main =  async () => {
        await initData() // json 파싱하는 것을 기다린다.
        renderGridView() // 데이터를 화면에 그려준다.
    }
    const setEventHandler = () => {} // 화살표에 이벤트리스너를 등록해 저장하는 함수

    const checkLocationType = (event) => {}; // 클릭한 화살표 방향을 확인해 업데이트 한다.

    const pageDisabled = (curPageNum) => {}; // curPageNum 값으로 각 화살표를 지워준다.

    const renderGridView = () => {}; 데이터를 화면에 그려주는 함수

    const initData = async() => {} // json 데이터를 파싱해 섞어준다 

    const splitIntoChunks = (newsData) => {} // 24개씩 잘라 companyData에 2차원 배열로 넣어준다

    const updatePageNum = (targetName) => {} // 클릭한 화살표 방향에 따라 currenPageNum 값을 업데이트 한다.

    const getGridTemplate = () => {}; // 데이터를 html 문자열로 생성하는 함수

    setEventHandler()
    return {main}
}

const gridViewForm = new GridViewForm()
export default gridViewForm
```

## TopNewsForm.js
 - [X] json 데이터를 파싱해 5개씩 잘라 각 객체에 넣어주어 관리한다.
```
const topNewsData = [
      { newsData: [], className: "first-top-news" },
      { newsData: [], className: "second-top-news" },
  ];
```
 - [X] newsData[0], newsData[1]의 데이터를 html로 만들어 화면에 그려준다.
 - [X] newsData[0]를 shift해 newsData에 push해 데이터를 업데이트하고 무한 롤링 되게 한다.
 - [X] setInterval으로 시간을 설정해 화면에 업데이트된 데이터를 일정 시간마다 그려준다.
```
function TopNewsForm() {
    const topNewsData = [
        { newsData: [], className: "first-top-news" },
        { newsData: [], className: "second-top-news" },
    ];

    const initData = async() => {} // json 데이터를 파싱해 topNewsData에 넣어준다.

    const spliceCompanyString = (newsData) => {} // 크롤링으로 가져온 데이터 언론사 이름에 "종합/경제 언론사 뉴스" 와 같이 불필요한 문자열이있어 "언론사 뉴스" 문자열을 잘라준다.

    const updateNewsData = () => {} // newsData[0]를 shift해 newsData에 push해 데이터를 업데이트

    const renderTopNews = async() => {} // 화면에 그려준다.

    const rollingNews = () => {} // setTimeout으로 renderTopNews을 계속 다시 그린다.

    const getTopNewsTemplate = async() => {} // 데이터를 html로 만든다.

    return {initData, renderTopNews, rollingNews };
}

const topNewsForm = new TopNewsForm();
export default topNewsForm;
```

### 에러 처리
 - [ ] 호버시 데이터를 다시 그려주는 js 코드 멈추는 기능 추가 / clear 사용
 - [ ] 롤링은 되지만 시간차가 맞지 않고 요구사항과 시간차가 달라 리펙토리 예정

## ListViewForm.js
 - [X] json 데이터를 파싱해 categoryList에 카테코리 별로 저장
 - [X] main뉴스와 sub뉴스를 나눠 각각 html을 만들고 화면에 그리기
 - [ ] curPageIdxInfo 값으로 화면에 그려줄 데이터 결정
 - [ ] 화살표 버튼을 눌렀을때 curPageIdxInfo 값을 없데이트하고 화면에 다시 데이터를 그려준다.
 - [ ] 카테고리별 데이터 끝에서 다음 카테고리로 넘어간다
 - [ ] rAF로 nav의 애니매이션 구현
 - [ ] 20초가 지났을때 다음 데이터로 넘어간다.
 - [ ] css파일을 분리하고 리네임해 가독성을 올린다.
 - [ ] document 부터 탐색하지 않고 탐색시간을 줄일 수 있는 방법을 생각한다.
 - [ ] 코드를 좀더 간결하고 가독성있게 리펙토링한다.
```
import jsonParse from "../util/jsonParse.js";
function ListViewForm() {
    const curPageIdxInfo = {
        curCategoryIdx: 0,
        curCategoryDataIdx: 0,
        curCategoryTotalNum: 0,
    };
    const categoryList = [
        { category: "종합/경제", data: [] },
        { category: "방송/통신", data: [] },
        { category: "IT", data: [] },
        { category: "영자지", data: [] },
        { category: "스포츠/연예", data: [] },
        { category: "매거진/전문지", data: [] },
        { category: "지역", data: [] },
    ];

    const main = async() => {
        await initData()
        renderNav()
        renderNews()
    }

    const renderNews = () => {}

    const getSubNewsTemplate = () => {}

    const getMainNewsTemplate = () => {}

    const renderNav = () => {}
    
    const initData = async () => {};

    const spliteData = (data) => {};

    const spliceCompanyString = (newsData) => {};

    const getNavTemplate = (clickCategory) => {};
    
    return { main };
}

const listViewForm = new ListViewForm()
export default listViewForm
```

