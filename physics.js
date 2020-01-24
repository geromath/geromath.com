export const collisionDetection = {
    start: function (level) {
        console.log('Firing up the engines!!!')
    },
    collisionStack: {},
    applyColliosionDetection: function (object) {
        let boundaries = [
            [object.x, object.y],
            [object.x + object.width, object.y],
            [object.x + object.width, object.y + object.height],
            [object.x, object.y + object.height]
        ];
        this.collisionStack[object] = boundaries;
        console.log("Applied collisions to: ", object, " \n And the collision stack is: ", this.collisionStack);
    },
}

