async function wait(time) {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export {
  wait
}