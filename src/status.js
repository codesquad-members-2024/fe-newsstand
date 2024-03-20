function NewsStandStateManager() {
    const status = { subscribeStatus: false, listMode: false };
    
    const setStatus = (key, value) => {
        status[key] = value;
    };
    
    const getStatus = () => {
        return status;
    };

    return {setStatus, getStatus}
}

const newsStandStateManager = new NewsStandStateManager()
export default newsStandStateManager;