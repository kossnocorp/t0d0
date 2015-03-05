# t0d0 — The Only Certificated TODO-Driven-Development Tool<sup>*</sup>

`t0d0` helps you to manage TODOs in your source code. 

It allows you to:

* Find and filter TODOs in your code base
* See who was the author
* When TODO was added
* Mark TODOs with tags

<img style="float: left" src="http://i.ncrp.co/image/3Q0g41022l2l/success.jpg">
> "**Using TODO-Driven-Development we managed to successfully spend 10x more investor's money just in few months!**" - John Jarrett, CEO of "[The Most Successful Ltd.](http://themostsuccessfulcompany.com)<sup>**</sup>

## Why I Should Use TODOs?

`TODO` in a source code it's one of the most underestimated engineering tools. It might be really powerful,

### Devide and Rule

Everybody knows "Devide and Rule" principle, if you have big problem it's easier to devide it into small problems and solve it rather than try to address it at once. 

## Intallation

```
npm install -g t0d0
```

The only hard dependency of t0d0 is "[The Silver Searcher](https://github.com/ggreer/the_silver_searcher)" (`ag`).

For OSX+brew `ag` can be installed with:
```
brew install ag
```

**See [installation instructions for your env](https://github.com/ggreer/the_silver_searcher#installing)**.

## Usage

To show all TODO statements (that matches "TODO:"):
```
todo
```

Display 10 lines for every TODO statement:
```
todo -l 10
```

Display all the TODOs (inluding reviewed; by default reviewed TODOs
will be displayed only after 2 weeks after review):
```
todo --all
```

## Tests (TODO)

```
npm test
```

For watch mode:

```
npm run-script autotest
```

## Roadmap

See [t0d0's kanban board](https://huboard.com/kossnocorp/t0d0) on HuBoard.

--

[_License (MIT)_](https://github.com/toptal/component-resolver-webpack/blob/master/docs/LICENSE.md)

--


_* - yes, this is a joke_

_** - yes, this is a joke too_

