Maze2 = function(width, height) {
    var N = 1 << 4,
        E = 1 << 3,
        S = 1 << 2,
        W = 1 << 1;
        V = 1 << 0;

    var all = width * height;
    var grid = new Array(all);
    for (var i = 0; i < width; ++i) {
        grid[i] = N | E | S | W;
    }

    var dirs = {
        'N': -width,
        'E': 1,
        'S': +width,
        'W': -1
    };

    var opposite = {
       'N': S,
       'E': W,
       'S': N,
       'W': E
    };

    var shuffle = function(array) {
        var i = 0
            , j = 0
            , temp = null

            for (i = array.length - 1; i > 0; i -= 1) {
                j = Math.floor(Math.random() * (i + 1))
                    temp = array[i]
                    array[i] = array[j]
                    array[j] = temp
            }
    };

    var stack = new Array();
    var current = Math.round(Math.random() * height) * width +
        Math.round(Math.random() * width);
    stack.push(current);
    grid[current] |= V;
    var visited = 1;

    for (; visited < all;) {
        //unvisited neighbours
        var dir = ['N', 'E', 'S', 'W'];
        shuffle(dir);
        var backtrack = true;
        for (var i = 0; i < 4; ++i) {
            n = current + dirs[dir[i]];
            if (n >= 0 && n < all && !(grid[n] & V)) {
                stack.push(current);
                grid[current] ^= dir[i];
                grid[n] ^= opposite[dir[i]];
                grid[n] |= V;
                visited++;
                current = n;
                backtrack = false;
                break;
            }
        }
        if (backtrack && stack.length > 0) {
            current = stack.pop();
        }
    }
};

Maze2.prototype.constructor = Maze2;
