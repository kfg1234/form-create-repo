export default function json() {
    return [
        {
            title: "输入框",
            type: "input",
            field: "input-field",
            value: "123456",
            // wrap: {
            //     show: false,
            // },
            effect: {
                str: "我是自定义属性",
            },
            // emit: ["change"],
            emit: [
                {
                    name: "on-change",
                    inject: "注入的参数",
                },
            ],
            // inject: true,
            // on: {
            //     "on-change": [
            //         (...arg) => {
            //             console.log("input-change", ...arg);
            //         },
            //     ],
            // },
            // col: {},
            props: {
                // type: "textarea",
                // rows: 10,
                // autosize: {
                //     minRows: 2,
                //     maxRows: 20,
                // },
            },
            children: [
                {
                    type: "icon",
                    props: {
                        type: "ios-checkmark",
                    },
                    slot: "prefix",
                },
            ],
        },
        // {
        //     title: "选择器",
        //     type: "select",
        //     field: "select-field",
        //     value: "123456",
        //     props: {},
        //     options: [
        //         {
        //             label: "苹果",
        //             value: "apple",
        //             slot(h) {
        //                 return [
        //                     h("span", "苹果"),
        //                     h("Icon", {
        //                         props: {
        //                             type: "logo-apple",
        //                         },
        //                     }),
        //                 ];
        //             },
        //         },
        //         {
        //             label: "香蕉",
        //             value: "banana",
        //         },
        //     ],
        //     children: [
        //         {
        //             type: "icon",
        //             slot: "prefix",
        //             props: {
        //                 type: "ios-add",
        //             },
        //         },
        //     ],
        // },
        // {
        //     title: "单选框",
        //     type: "radio",
        //     field: "radio-field",
        //     value: "选项1",
        //     options: [
        //         {
        //             label: "选项1",
        //             slot(h) {
        //                 return h("Icon", {
        //                     props: {
        //                         type: "logo-apple",
        //                     },
        //                 });
        //             },
        //         },
        //         {
        //             label: "选项2",
        //         },
        //     ],
        // },
        // {
        //     title: "复选框",
        //     type: "checkbox",
        //     field: "checkbox-field",
        //     value: ["选项1"],
        //     options: [
        //         {
        //             label: "选项1",
        //             slot(h) {
        //                 return h("Icon", {
        //                     props: {
        //                         type: "logo-apple",
        //                     },
        //                 });
        //             },
        //         },
        //         {
        //             label: "选项2",
        //         },
        //     ],
        // },
    ];
}
