import EmojiJS from "emoji-js";
export { default as Picker } from "./Picker";
import { getEmojiDataFromNative } from "emoji-mart";
import data from "emoji-mart/data/all.json";

export function image(unified: string) {
    return `/emoji/img/${unified}.png`;
}

let Engine = EmojiJS as any;

export class Emoji extends Engine {
    data: any;

    inits: any;

    allow_native: boolean;

    replace_mode: string;

    variations_data: any;

    rx_unified_tester: RegExp;

    constructor() {
        super();
        this.allow_native = true;
        this.replace_mode = "unified";
        this.rx_unified_tester = this.init_emoticon_tester();
    }

    imagePath(unified: string) {
        return `/images/emoji/${unified}.png`;
    }

    fromNative(native: string) {
        const emojiset = "twitter";
        return getEmojiDataFromNative(native, emojiset, data as any);
    }

    imagePathFromNative(native: string) {
        const data = this.fromNative(native);
        return this.imagePath(data.unified);
    }

    init_emoticon_tester() {
        if (this.inits.unified_tester) this.rx_unified_tester;

        this.inits.unified_tester = 1;

        var a = [];

        for (let i in this.data) {
            for (let j = 0; j < this.data[i][0].length; j++) {
                a.push(this.data[i][0][j].replace("*", "\\*"));
            }
        }
        for (let i in this.variations_data) {
            // skip simple append-style skin tones
            if (this.variations_data[i]["1f3fb"][0] === i + "-1f3fb") continue;

            for (let k in this.variations_data[i]) {
                for (let j = 0; j < this.variations_data[i][k][4].length; j++) {
                    a.push(
                        this.variations_data[i][k][4][j].replace("*", "\\*")
                    );
                }
            }
        }

        a = a.sort(function (a, b) {
            return b.length - a.length;
        });

        return (this.rx_unified_tester = new RegExp(
            "^((" + a.join("|") + ")(\uD83C[\uDFFB-\uDFFF])?)$",
            "g"
        ));
    }

    isEmoticon(emoticon: string) {
        const result = this.rx_unified_tester.test(emoticon);
        this.rx_unified_tester.lastIndex = 0;
        return result;
    }
}

const emoji = new Emoji();
emoji.init_env(); // else auto-detection will trigger when we first convert

export default emoji;
