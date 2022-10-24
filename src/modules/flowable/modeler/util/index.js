export const FileSelector = function ({ onLoad = () => { } } = {}) {
    if (window['FileReader']) {
        const input = document.createElement('input')
        input.type = "file"
        const frag = document.createDocumentFragment()
        frag.appendChild(input)
        input.onchange = function (e) {
            const files = e.target.files || []
            if (files.length === 0) {
                return
            }
            const file = files[0]
            const reader = new FileReader()
            reader.readAsText(file, 'utf-8')
            reader.onload = function (event) {
                onLoad(event.target.result)
            }
        }
        return input
    }
    return null
}

export function uuid(len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.
        // At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
