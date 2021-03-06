import { extend, toArray } from "@form-create/utils";
import is, { hasProperty } from "@form-create/utils/type";
import { invoke, parseValidate } from "../frame/utils";
import { $set } from "@form-create/utils/modify";
export default function useInput(Handle) {
    extend(Handle.prototype, {
        addSubForm(ctx, subForm) {
            if (ctx.input) {
                this.subForm[ctx.id] = subForm;
            }
        },
        getValue(ctx) {
            // 初始时已经经过了toFormValue的转化，这里又会经toValue在转化一次
            if (is.Undef(ctx.cacheValue)) {
                ctx.cacheValue = ctx.parser.toValue(this.getFormData(ctx), ctx);
            }
            return ctx.cacheValue;
        },
        setValue(ctx, value, formValue, setFlag) {
            if (ctx.deleted) return;
            ctx.cacheValue = value;
            this.changeStatus = true;
            this.nextRefresh();
            this.$render.clearCache(ctx); //如果不清除，renderCtx方法会从缓存中取VNode
            this.setFormData(ctx, formValue);
            this.valueChange(ctx, value);
            this.vm.$emit("change", ctx.field, value, ctx.origin, this.api, setFlag);
            this.effect(ctx, "value");
        },
        // v-model绑定时的回调
        onInput(ctx, value) {
            let val;
            if ((ctx.input && this.isQuote(ctx, (val = ctx.parser.toValue(value, ctx)))) || this.isChange(ctx, value)) {
                this.setValue(ctx, val, value);
            }
        },
        // 在form-create实例render过程中，只要访问了formData，Dep就会收集form-create实例
        getFormData(ctx) {
            return this.formData[ctx.id];
        },
        setFormData(ctx, formValue) {
            $set(this.formData, ctx.id, formValue);
        },
        valueHandle(ctx) {
            return {
                enumerable: true,
                get: () => {
                    return this.getValue(ctx);
                },
                set: (value) => {
                    if (this.isChange(ctx, value)) {
                        this.setValue(ctx, value, ctx.parser.toFormValue(value, ctx), true);
                    }
                },
            };
        },
        valueChange(ctx, value) {
            this.refreshRule(ctx, value);
        },
        refreshRule(ctx, value) {
            // control的条件成立时，还需要再次触发loadRule，执行load-start方法
            if (this.refreshControl(ctx)) {
                // 因为不知道新增的control.rule会插入到哪里，清空所有缓存VNode
                this.$render.clearCacheAll(); //可以优化
                this.loadRule();
                this.vm.$emit("update", this.api);
                this.refresh();
            } else {
                this.syncValue();
            }
        },
        // 判断rule.value是否发生改变
        isChange(ctx, value) {
            return JSON.stringify(ctx.rule.value, strFn) !== JSON.stringify(value, strFn);
        },
        /*
            设置表单组件value的初始值
            通过在form-create组件上绑定的value.sync优先级更高
            option.formData次之
            rule.value最低
        */
        appendValue(rule) {
            if (!rule.field || !hasProperty(this.appendData, rule.field)) return;
            rule.value = this.appendData[rule.field];
            delete this.appendData[rule.field];
        },
        /*
            重新对form-create上:value.sync绑定的属性进行设置
            通过valueHandle进行代理
            所以不论是修改了rule.value还是修改了:value.sync绑定的value初始值
            都会触发更新操作
        */
        syncForm() {
            toEmpty(this.form);
            Object.defineProperties(
                this.form,
                this.fields().reduce(
                    (initial, field) => {
                        const ctx = this.getFieldCtx(field);
                        const handle = this.valueHandle(ctx); //通过valueHandle进行代理
                        handle.configurable = true;
                        initial[field] = handle;
                        return initial;
                    },
                    /*
                        先对剩余appendData进行代理，都是在rules中没有定义对应的field控件
                        如果更新了，appendData重新赋为新值即可
                    */
                    Object.keys(this.appendData).reduce((initial, field) => {
                        initial[field] = {
                            enumerable: true,
                            configurable: true,
                            get: () => {
                                return this.appendData[field];
                            },
                            set: (val) => {
                                this.appendData[field] = val;
                            },
                        };
                        return initial;
                    }, {})
                )
            );
            this.syncValue();
        },
        //更新到form-create上:value.sync绑定的属性
        syncValue() {
            if (this.deferSyncFn) {
                return (this.deferSyncFn.sync = true);
            }
            this.vm._updateValue({ ...this.form });
            // this.vm._updateValue(this.form);
        },
        // 当递归调用传入的方法时，等所有递归结束后再执行syncValue方法
        deferSyncValue(fn, sync) {
            if (!this.deferSyncFn) {
                this.deferSyncFn = fn;
            }

            if (!this.deferSyncFn.sync) {
                this.deferSyncFn.sync = sync;
            }

            invoke(fn);

            if (this.deferSyncFn === fn) {
                this.deferSyncFn = null;
                if (fn.sync) {
                    this.syncValue();
                }
            }
        },
        // 生成表单的校验规则
        validate() {
            toEmpty(this.vm.validate);
            this.fields().forEach((field) => {
                this.fieldCtx[field].forEach((ctx) => {
                    this.vm.validate[ctx.id] = parseValidate(toArray(ctx.rule.validate));
                });
            });
            return this.vm.validate;
        },
        // 判断value是不是引用类型，且与之前的value相等
        isQuote(ctx, value) {
            return (is.Object(value) || Array.isArray(value)) && value === ctx.rule.value;
        },
        fields() {
            return Object.keys(this.fieldCtx);
        },
    });
}

function strFn(key, val) {
    return typeof val === "function" ? "" + val : val;
}

function toEmpty(obj) {
    Object.keys(obj).forEach((k) => delete obj[k]);
}
