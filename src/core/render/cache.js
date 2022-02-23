import { extend } from "@/utils";

export default function useRender(Render) {
    extend(Render.prototype, {
        initCache() {
            this.clearCacheAll();
        },
        clearCacheAll() {
            this.cache = {};
        },
        setCache(ctx, vnode, parent) {
            this.cache[ctx.id] = {
                vnode,
                use: false,
                parent,
                slot: ctx.rule.slot,
            };
        },
        getCache(ctx) {
            const cache = this.cache[ctx.id];
            cache.use = true;
            return cache.vnode;
        },
    });
}