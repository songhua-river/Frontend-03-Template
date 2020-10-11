class Trie {
    constructor() {
        this.node = Object.create(null);
        this.$ = Symbol("$");
    }
    insert(str) {
        let node = this.node;
        for (let s of str) {
            if (!node[s]) {
                node[s] = Object.create(null);
            }
            node = node[s];
        }
        if (!node[this.$]) node[this.$] = 0;
        node[this.$]++;
    }
    most() {
        let node = this.node;
        let max = 0;
        var that = this;
        let mostword = ''

        function visit(node, word) {
            if (node[that.$] && node[that.$] > max) {
                console.log(node)
                max = node[that.$];
                mostword = word;
            }
            for (let s in node) {
                visit(node[s], word + s)
            }
        }
        visit(node, '');
        console.log(max, mostword)
    }
}
const trie = new Trie();
for (var i = 0; i < 1000000; i++) {
    var str = new Array(4).fill(0).map(item => String.fromCharCode(Math.floor(Math.random() * 26) + 'a'
        .charCodeAt())).join('');
    trie.insert(str);
}