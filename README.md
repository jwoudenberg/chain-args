# Chain Args
[![NPM version](https://badge.fury.io/js/chain-args.svg)](http://badge.fury.io/js/chain-args)
[![Code Climate](https://codeclimate.com/github/jwoudenberg/chain-args.png)](https://codeclimate.com/github/jwoudenberg/chain-args)

Chain Args allows you to take a function you'd usually call like this:

```js
setOptions({
    color: 'blue',
    amount: 8
    loud: true
});
```

And change it to a function you can call like this:

```js
setOptions2()
    .color('blue')
    .amount(8)
    .loud(true);
```
