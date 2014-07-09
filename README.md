# Chain Args
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
