# t0d0 (prototype)

## Intallation

```
npm install -g t0d0
```

The only hard dependency of t0d0 is "[The Silver Searcher](https://github.com/ggreer/the_silver_searcher)" (`ag`).

For OSX+brew users it will be:
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

See t0d0's [kanban board](https://huboard.com/kossnocorp/t0d0) on HuBoard.

--

[_License (MIT)_](https://github.com/toptal/component-resolver-webpack/blob/master/docs/LICENSE.md)
