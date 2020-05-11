const app = {
    state: {
        menuList: [],
        menuActiveKey: ['/portal'],
        openKeys: [],
        debugMode: false,
        defaultPassword: '123456'
    },
    mutations: {
        updateMenulist (state, menus) {
            state.menuList = menus;
        },
        setMenuActiveKey(state, key){
            state.menuActiveKey = key
        },
        setOpenKeys(state, key){
            state.openKeys = key
        },
        removeMenuActiveKey(state){
            state.menuActiveKey = ['/portal']
        },
        removeOpenKeys(state){
            state.openKeys = []
        }
    }
};

export default app;
