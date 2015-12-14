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

## Demo

Click [here](http://marekpagel.github.io/Music-Maze/) for live demo.

![](http://fat.gfycat.com/CriminalShinyBaiji.gif)
