class Utils {
    public static countCapitals(text: string): number {
        let capitals = 0;
        for (const c of text) {
            if (parseInt(c).toString() !== c && c === c.toUpperCase() && c !== c.toLowerCase()) {
                capitals++;
            }
        }

        return capitals;
    }

    public static countLetters(text: string): number {
        let letters = 0;
        for (const c of text) {
            if (Utils.isLetter(c)) {
                letters++;
            }
        }

        return letters;
    }

    public static removeRepeatedCharacters(text: string): string {
        let newText = "";
        let lastChar = "";
        let lastCharCount = 0;

        for (const c of text) {
            if (c !== lastChar || ++lastCharCount < 2) {
                newText += c;

                if (c !== lastChar) {
                    lastCharCount = 0;
                }

                lastChar = c;
            }
        }

        return newText;
    }

    public static isLetter(text) {
         return /[A-z]/.test(text);
    }

    public static stripTags(text) {
        text = text.replace(/\[.*?:(.*?)\]/g, "$1");
        return text;
    }
}

export default Utils;
