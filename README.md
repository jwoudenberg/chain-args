# Chain Args
Chain Args allows you to take a function you'd usually call like this:

```
setOptions({
    color: 'blue',
    amount: 8
    loud: true
})
```

And change it to a function you can call like this:

```
setOptions2()
    .color('blue')
    .amount(8)
    .loud(true);
```
