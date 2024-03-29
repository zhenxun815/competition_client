// Type definitions for iview 3.1.0
// Project: https://github.com/iview/iview
// Definitions by: yangdan
// Definitions: https://github.com/yangdan8/iview.git
// @ts-ignore
import Vue from 'vue';

export declare interface Time extends Vue {
    /**
     * 需要对比的时间，可以是时间戳或 Date 类型
     */
    time?: number | Date | string;
    /**
     * 类型，可选值为 relative、date 或 datetime
     * @default relative
     */
    type?: 'relative' | 'date' | 'datetime';
    /**
     * 自动更新的间隔，单位：秒
     * @default 60
     */
    interval?: number;
    /**
     * 填写该值，点击会定位锚点
     * @default false
     */
    hash?: string;
}