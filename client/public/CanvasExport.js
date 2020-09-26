onmessage = function (event) {
  if (event.data.obj && event.data.obj.toDataURL) {
    const result = event.data.type
      ? event.data.obj.toDataURL(event.data.type)
      : event.data.obj.toDataURL();
    postMessage(result);
  }
};
