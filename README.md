# t0d0 (prototype)

## Intallation

```
brew install ag
npm install -g t0d0
```

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

