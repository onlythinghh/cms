<template>
    <el-dropdown trigger="click" @command="selectLanguage">
        <span class="el-dropdown-link">
            <i class="el-icon-s-flag el-icon--left"/>
            {{ currentLanguage.languageName }}
            <i
                class="el-icon-arrow-down el-icon--right"
            />
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
                v-for="lang in langs"
                :key="lang.key"
                :command="lang.key"
                :disabled="currentLanguage.language === lang.key"
            >{{ lang.text }}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
import i18n from "../i18n";
import { cookie } from "../utils/WebStore";
import { LANGUAGE } from "../utils/Const";
export default {
    name: "LangSelect",
    computed: {
        langs: function () {
            const messages = i18n._getMessages();
            const langs = [];
            Object.keys(messages).forEach(langKey => {
                let languageName = messages[langKey].__name__;
                languageName = languageName || langKey;
                const lang = {
                    key: langKey,
                    text: languageName
                };
                langs.push(lang);
            });
            return langs;
        },
        currentLanguage: function () {
            const language = i18n.locale;
            let languageName = "";
            this.langs.some(lang => {
                if (lang.key === language) {
                    languageName = lang.text;
                    return true;
                }
                return false;
            });
            return {
                language,
                languageName
            };
        }
    },
    methods: {
        selectLanguage(command) {
            cookie.set(LANGUAGE, command);
            i18n.locale = command;
        }
    }
};
</script>

