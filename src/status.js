function NewsStandStateManager() {
    const status = { subscribeStatus: false, listMode: false };
    
    const setStatus = (subscribeBoolean, listModeBoolean) => {
        status.subscribeStatus = subscribeBoolean;
        status.listMode = listModeBoolean;
    };
    
    const getStatus = () => {
        return status;
    };

    return {setStatus, getStatus}
}

const newsStandStateManager = new NewsStandStateManager()
export default newsStandStateManager;