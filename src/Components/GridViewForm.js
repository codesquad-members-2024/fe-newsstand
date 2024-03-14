import jsonParse from "../util/jsonParse.js";
import { FIRST_PAGE_NUM, LAST_PAGE_NUM } from "../util/contants.js";
function GridViewForm () {
    let currenPageNum = 0;
    const companyData = [];

    const main =  async () => {
        await initData()
        renderGridView()
    }

    const setEventHandler = () => {
        const updatePageBtn = document.querySelector(".company-grid-container");
        updatePageBtn.addEventListener("click", checkLocationType);    
    }

    const checkLocationType = (event) => {
        const curPageNum = updatePageNum(event.target.className);
        renderGridView();
        pageDisabled(curPageNum);
    };

    const pageDisabled = (curPageNum) => {
        const leftBtnBox = document.querySelector(".left-btn");
        const lightBtnBox = document.querySelector(".light-btn");
        switch (curPageNum) {
            case FIRST_PAGE_NUM:
                leftBtnBox.style.display = "none";
                break;
            case LAST_PAGE_NUM:
                lightBtnBox.style.display = "none";
                break;
            default:
                leftBtnBox.style.display = "flex";
                lightBtnBox.style.display = "flex";
                break;
        }
    };

    const renderGridView = () => {
        const logoTemplate = getGridTemplate();
        const companyDisplayBox = document.querySelector(".company-display");
        companyDisplayBox.innerHTML = logoTemplate;
    };

    const initData = async() => {
        const newsData = await jsonParse.parseJson("companiesInfo")
        newsData.sort(() => Math.random() - 0.5)
        splitIntoChunks(newsData);
    }

    const splitIntoChunks = (newsData) => {
        while (newsData.length !== 0) {
            companyData.push(newsData.splice(0, 24));
        }
    }

    const updatePageNum = (targetName) => {
        switch (targetName) {
            case "left-btn":
                currenPageNum--;
                break;
            case "light-btn":
                currenPageNum++;
                break;
            default:
                break;
        }
        return currenPageNum
    }

    const getGridTemplate = () => {
        const logoTemplate = companyData[currenPageNum].reduce((acc, cur, idx) => {
            return acc + `
            <li class="list-${idx}">
            <img class = "logo-img" src = "${cur.img}" alt = ${cur.companyName}>
            <button class = "subscribe"> + 구독하기</button>
            </li>
            `;
        }, "");
        return logoTemplate;
    };

    setEventHandler()
    return {main}
}

const gridViewForm = new GridViewForm()
export default gridViewForm
