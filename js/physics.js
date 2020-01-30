export const collisionDetection = {
    start: function(level) {
        console.log("Firing up the engines!!!");
    },
    collisionStack: {},
    applyColliosionDetection: function(object) {
        let boundaries = [
            [object.x, object.y],
            [object.x + object.width, object.y],
            [object.x + object.width, object.y + object.height],
            [object.x, object.y + object.height]
        ];
        this.collisionStack[object] = boundaries;
        console.log(
            "Applied collisions to: ",
            object,
            " \n And the collision stack is: ",
            this.collisionStack
        );
    },
    groundCheck: function(object) {
        // Check wether this item is touching ground.
    },
    collisionCheck: function(object) {
        // Checks wether the item is touching anything - returns -1 for left, 1 for right and 0 for top
    }
};
