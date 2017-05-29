/* eslint-disable no-param-reassign */
export default {
    state: {
        editors: [],
        curEditor: -1,
    },
    mutations: {
        openFile(state, file) {
            const index = state.editors.findIndex(item => item.fullpath === file.fullpath);
            if (index < 0) {
                state.editors.push(file);
                state.curEditor = state.editors.length - 1;
            } else {
                state.curEditor = index;
            }
        },
        reseteditor(state) {
            state.editors = [];
            state.curEditor = -1;
        },
        removeEditor(state, fullpath) {
            const index = state.editors.findIndex(item => item.fullpath === fullpath);
            if (index > -1) {
                state.editors.splice(index, 1);
            }
        },
    },
    actions: {

    },
};
