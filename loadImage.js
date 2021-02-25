export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = function () {
      resolve(image)
    }
    image.onerror = function (event) {
      reject(event)
    }
  })
}
