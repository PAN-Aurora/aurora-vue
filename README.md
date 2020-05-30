# web-client

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 自定义Grid组件
```
数据结构
gridOption: {
    beforeEdit: () {},      //编辑之前对rowData进行格式化等
    beforeSubmit: () {},    //提交之前对rowData进行格式化等
    loadData: false,        //是否在created阶段加载数据，默认加载
    singleCol: true,        //是否单列显示，默认为双列显示
    btnOperation: {         //是否显示按钮选项
        add: false,
    },
    extraOperation: [       //额外的按钮显示
        {
            title: '按钮名称',
            iconFormat: (row) => {
                let icon = 'play-circle'
                if (row.state) {
                    icon = 'pause-circle'
                }
                return icon
            },
            click: () => {}
        }
    ],
    url: {                 //非默认model的增删改查配置
        list: '/api/recordTask/list',
        create: '/api/front/taskCreate',
        delete: '/api/front/taskDelete',
        update: '/api/front/taskUpdate',
    },
    column: [               //列的定义
       {
            title: '前端名称',          //列显示名称
            dataIndex: 'frontName',    //与dataSource行数据的key值
            type: 'input',             //现在有input,number,select,radioGroup,switch,datetimePicker,datetPicker,textarea,cascader
            decorator: ['frontName',{rules: [{ required: true, message: '不能为空！' }]}],      //formItem需要绑定的字段
            disabled: true             //可配置项,true状态按钮为disabled
        }
    ],

}

```
