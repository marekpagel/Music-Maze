# Music-Maze

## About

This is a project for Computer Graphics course 2015, University of Tartu.
Aim of the project is to procedurally generate and follow a maze that varies based on analysis of currently playing music

## How it works

The main idea behind maze generation is similar to how stochastic [L-systems](https://en.wikipedia.org/wiki/L-system) work:
we have a set of rules (in this case does the corridor branch left, right and front) that are activated based on the
attached set of probabilities to those rules.

At each point in time, 2 levels of branches are pre-generated, one of which the path camera class will choose and
move towards, triggering the next of branches on that path.

Music analysis comes into play by manipulatng the probability distribution of the rules, i.e. long corridors for fast paced tracks.

The difference from L-systems is that we don't recursively build the whole tree - only the path that was chosen.

## Music streaming and analysis

Music is streamed by using HTML5 audio element. It is connected to the Web
Audio API, which lets us do things like delaying the music for ahead of time
analysis. Web Audio API lets us do frequency domain analysis very easily and we
use that info to detect large changes in the lower frequency range. Based on
the amount of "beats" we assing probabilities to maze generation.

## RGB - splitting

In some music videos they use RGB splitting when the bass kicks. Implementing
it is pretty straightforward, as it is an post-processing pass. At first the
regular scene is rendered onto a texture. Then the terture is applied to quad
and rendered to screen with special shader, which does the actual splitting of
RGB channels.

## Smooth moving

It is well known that javascript timers are inaccurate. When animating a moving
object we want the animation to be smooth. For this we can use a high
performance timer. At the start of movement we store the start position and
the start time. Then we can use the same timer in the draw callback to
calculate the linear displacement. Luckily there is a very simple library
called [tween.js](https://github.com/tweenjs/tween.js), that abstracts the
details away.

## Demo

Click [here](http://marekpagel.github.io/Music-Maze/) for live demo.

![demo](https://cloud.githubusercontent.com/assets/195271/11809061/df209ef0-a32c-11e5-8962-4ef5ce759aa6.gif)
