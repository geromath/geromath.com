# geromath.com
Personal web page used for simple things and messing around with HTML, CSS and JS

- [x] On push, website updates automatically

## Things I plan on implementing

- [ ] Collision detection
- [ ] Grab and throw objects
- [ ] Navigation through doors
- [ ] Level creator

- [ ] Make the game objects be a library (maybe ...)

## Who am I?
I am @geromath :raised_hand_with_fingers_splayed:

This is me.
![Profile picture]()


## The systems

### The collision detection system
This system applies collisiondetection to an element. To apply the collisiondetection you have to use the `applyCollisionDetection` to the object while instantiating it. This does a few things:

1. Add boundaries to the object
2. Adds the object to a stack that gets checked for collisions every frame
