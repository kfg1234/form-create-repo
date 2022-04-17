const label = "栅格布局";
const name = "row";

export default {
    icon: "md-reorder",
    label,
    name,
    children: "col",
    rule() {
        return {
            type: name,
            props: {
                gutter: 0,
                wrap: true,
            },
            children: [],
        };
    },
    props() {
        return [
            {
                title: "栅格间距",
                type: "inputNumber",
                field: "gutter",
            },
            {
                title: "使用 flex 布局",
                type: "switch",
                field: "type",
                inject: true,
                props: {
                    trueValue: "flex",
                    falseValue: null,
                },
                control: [
                    {
                        value: "flex",
                        rule: [
                            {
                                title: "垂直对齐方式",
                                type: "select",
                                field: "align",
                                props: {
                                    clearable: true,
                                },
                                options: [
                                    {
                                        label: "top",
                                        value: "top",
                                    },
                                    {
                                        label: "middle",
                                        value: "middle",
                                    },
                                    {
                                        label: "bottom",
                                        value: "bottom",
                                    },
                                ],
                            },
                            {
                                title: "水平排列方式",
                                type: "select",
                                field: "justify",
                                props: {
                                    clearable: true,
                                },
                                options: [
                                    {
                                        label: "start",
                                        value: "start",
                                    },
                                    {
                                        label: "end",
                                        value: "end",
                                    },
                                    {
                                        label: "center",
                                        value: "center",
                                    },
                                    {
                                        label: "space-around",
                                        value: "space-around",
                                    },
                                    {
                                        label: "space-between",
                                        value: "space-between",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                title: "是否自动换行",
                type: "switch",
                field: "wrap",
            },
        ];
    },
};
