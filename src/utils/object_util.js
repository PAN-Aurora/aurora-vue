import {POST} from './restful_util'
import __ from 'lodash'
export function generateMenus (_this, array, source){
    let menu = []
    let addRoutes = []
    if (_this.$store.state.app.debugMode) {
        menu = source
        for (let parent of source) {
            if (parent.redirect) {
                addRoutes.push(parent)
            }
            if (parent.children) {
                for(let child of parent.children) {
                    addRoutes.push(child)
                }
            }
        }
    } else {
        for (let parent of source) {
            let menuItem = null
            let children = []
            if (parent.children) {
                for (let child of parent.children) {
                    if (array.indexOf(child.key) > -1) {
                        if (menuItem === null) {
                            menuItem = __.cloneDeep(parent)
                        }
                        children.push(child)
                        // addRoutes.push(child)
                    }
                }
            } else {
                if (array.indexOf(parent.key) > -1) {
                    menuItem = __.cloneDeep(parent)
                }
            }
            if (menuItem) {
                menuItem.children = children
                menu.push(menuItem)
                addRoutes.push(menuItem)
            }
        }
    }

    return {
        menu: menu,
        addRoutes: addRoutes
    }
}

export function generateOptions (_this, url, rule, condition) {
    return new Promise(resolve => {
        POST(_this, url, condition || {}, (res) => {
            let array = []
            if (res.code === 1) {
                array = res.data.list.map((item) => {
                    return {
                        label: item[rule.key],
                        value: item[rule.value]
                    }
                })
            }
            resolve(array)
        })
    })
    
}