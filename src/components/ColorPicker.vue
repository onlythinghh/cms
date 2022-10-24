<template>
    <div
        class="color-picker"
        @click.stop
    >
        <span
            :class="['color-picker__color', !value && 'is-not']"
            :style="{ background: value }"
            @click.stop="!disabled && (isShowMore = true)"
        ></span>
        <div
            v-show="isShowMore"
            class="more-wrapper"
        >
            <p>常用颜色</p>
            <ul class="more-color">
                <li
                    v-for="(item, index) in colorList"
                    :key="index"
                    :class="['item', !item && 'is-not']"
                    :style="{ background: item }"
                    @click.stop="chooseColor(item)"
                ></li>
            </ul>
            <el-button class="choose-more">
                更多颜色
                <el-color-picker v-model="color"></el-color-picker>
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ColorPicker',
    props: {
        value: {
            type: String,
            default: '#000000'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            colorList: ['', '#000000', '#ff0000', '#0000ff'],
            color: '#ffffff',
            isShowMore: false
        }
    },
    watch: {
        color (v) {
            this.updateColor(v)
        }
    },
    mounted() {
        this.$nextTick(() => {
            document.addEventListener('click', () => {
                this.isShowMore = false
            })
        })
    },
    methods: {
        chooseColor(color) {
            this.updateColor(color)
        },
        updateColor(value) {
            this.color = value
            this.$emit('input', value)
            this.$emit('change', value)
            this.isShowMore = false
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    border: 0;
}
.color-picker {
    position: relative;
    display: inline-block;
    width: 25px;
    height: 25px;
    padding: 3px;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    border-radius: 4px;

    .is-not {
        position: relative;
        border: 1px solid #dcdfe6;

        &:before {
            content: '';
            position: absolute;
            top: 50%;
            left: -3px;
            width: calc(100% + 5px);
            height: 1px;
            background-color: #f00;
            transform: translateY(-50%) rotateZ(-45deg);
        }
    }

    .color-picker__color {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
    }

    .more-wrapper {
        position: absolute;
        top: 100%;
        left: 50%;
        z-index: 999;
        padding: 10px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        text-align: left;
        transform: translateX(-50%) translateY(5px);
    }

    .more-color {
        display: flex;
    }

    .item {
        width: 20px;
        height: 20px;
        margin: 0 3px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .choose-more {
        position: relative;
        width: 100%;
        margin-top: 10px;

        .el-color-picker {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;

            /deep/ .el-color-picker__trigger {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
