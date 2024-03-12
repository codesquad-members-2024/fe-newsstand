import jsonParse from "../jsonParse.js";
export function GridModeForm() {
    let curCategoryIdx = 0;
    let curCategoryTotalNum = 0;
    const categoryList = [
        { category: "종합/경제", data: [] },
        { category: "방송/통신", data: [] },
        { category: "IT", data: [] },
        { category: "영자지", data: [] },
        { category: "스포츠/연예", data: [] },
        { category: "매거진/전문지", data: [] },
        { category: "지역", data: [] },
    ];
    const initData = async () => {
        const newsData = await jsonParse.parseJson("category");
        const modifyData = spliceCompanyString(newsData);
        spliteData(modifyData);
    };

    const spliteData = (data) => {
        categoryList.forEach((curCategory) => {
            data.forEach((curNewsData) => {
                if (curNewsData.category.includes(curCategory.category)) {
                    curCategory.data.push(curNewsData);
                }
            });
        });
    };

    const spliceCompanyString = (newsData) => {
        return newsData.map((curNewsData) => {
            const spliceName = curNewsData.category.split("언론사")[0];
            curNewsData.category = spliceName;
            return curNewsData;
        });
    };

    const getListNavTemplate = (clickCategory) => {
        const navTemplate = categoryList.reduce((acc, cur, idx) => {
            return acc + `
            <div class="item" id = "${cur.category}">
            <span>${cur.category}</span>
            </div>
            `
        }, "");
        return navTemplate;
    };
    
    return { initData, getListNavTemplate };
}
