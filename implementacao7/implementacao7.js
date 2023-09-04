const fileinput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
let srcImage = new Image
let imgData = null

fileinput.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    srcImage.src = URL.createObjectURL(e.target.files[0])
    if (fileinput.files[0].name.includes('.pgm')) {

      let widthImgPGM1 = 0
      let heightImgPGM1 = 0
      let reader = new FileReader()
      let values = []

      reader.onload = function (event) {
        let text = this.result
        let lines = text.split('\n')
        heightImgPGM1 += lines.length - 3
        for (let i = 3; i < lines.length; i++) {
          const aux = lines[i].split(' ')
          if (aux.length > 1) {
            widthImgPGM1 = aux.length
          }
          for (let j = 0; j < aux.length; j++) {
            values.push(aux[j])
          }
        }
        let data = getRGBfromInt(values)
        let newImgData = new ImageData(widthImgPGM1, heightImgPGM1)
        for (let i = 0; i < newImgData.data.length; i += 4) {
          newImgData.data[i] = data[i]
          newImgData.data[i + 1] = data[i + 1]
          newImgData.data[i + 2] = data[i + 2]
          newImgData.data[i + 3] = data[i + 3]
        }
        srcImage = imgDataToImg(newImgData, widthImgPGM1, heightImgPGM1)
        srcImage.onload = function () {
          canvas.width = srcImage.width
          canvas.height = srcImage.height
          ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
          imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
        }
      }
      reader.readAsText(fileinput.files[0])

    } else {
      srcImage.onload = function () {
        canvas.width = srcImage.width
        canvas.height = srcImage.height
        ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
        imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
      }
    }
  }
}

//FATIAMENTO
const fatiar = document.getElementById('fatiar')

let fatias = new Array(8)
fatias[0] = document.getElementById('fatia1')
fatias[1] = document.getElementById('fatia2')
fatias[2] = document.getElementById('fatia3')
fatias[3] = document.getElementById('fatia4')
fatias[4] = document.getElementById('fatia5')
fatias[5] = document.getElementById('fatia6')
fatias[6] = document.getElementById('fatia7')
fatias[7] = document.getElementById('fatia8')

let fatiasContext = new Array(8)
fatiasContext[0] = fatias[0].getContext('2d')
fatiasContext[1] = fatias[1].getContext('2d')
fatiasContext[2] = fatias[2].getContext('2d')
fatiasContext[3] = fatias[3].getContext('2d')
fatiasContext[4] = fatias[4].getContext('2d')
fatiasContext[5] = fatias[5].getContext('2d')
fatiasContext[6] = fatias[6].getContext('2d')
fatiasContext[7] = fatias[7].getContext('2d')

let fatiasImg = new Array(8).fill(new Image)

let bitPlanes = new Array(8)

fatiar.onclick = function () {

  for (let i = 0; i < 8; i++) {
    bitPlanes[i] = new Uint8ClampedArray(imgData.data.length);
  }

  for (let i = 0; i < imgData.data.length; i += 4) {
    let pixelValue = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3
    for (let bit = 0; bit < 8; bit++) {
      bitPlanes[bit][i] = (pixelValue >> bit) & 1
    }
  }

  for (let j = 0; j < 8; j++) {
    let newImgData = new ImageData(srcImage.width, srcImage.height)
    for (let i = 0; i < imgData.data.length; i += 4) {
      let bitValue = bitPlanes[j][i] * 255
      newImgData.data[i] = bitValue
      newImgData.data[i + 1] = bitValue
      newImgData.data[i + 2] = bitValue
      newImgData.data[i + 3] = 255
    }
    fatiasImg[j] = imgDataToImg(newImgData, srcImage.width, srcImage.height)
    fatias[j].width = fatiasImg[j].width
    fatias[j].height = fatiasImg[j].height
    fatiasContext[j].drawImage(fatiasImg[j], 0, 0, fatiasImg[j].width, fatiasImg[j].height)
  }
}

function imgDataToImg(imagedata, w, h) {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  canvas.width = w
  canvas.height = h
  ctx.putImageData(imagedata, 0, 0)
  var image = new Image()
  image.src = canvas.toDataURL()
  return image
}

function getRGBfromInt(values) {
  let image = []

  for (let i = 0; i < values.length; i++) {
    image.push(values[i])
    image.push(values[i])
    image.push(values[i])
    image.push(255)
  }

  return image
}

function getNormalise(imageData) {
  let maiores = [imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]]
  let menores = [imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]]

  for (let i = 4; i < imgData.data.length; i += 4) {
    if (imageData.data[i] > maiores[0]) { maiores[0] = imageData.data[i] }
    if (imageData.data[i + 1] > maiores[1]) { maiores[1] = imageData.data[i + 1] }
    if (imageData.data[i + 2] > maiores[2]) { maiores[2] = imageData.data[i + 2] }
    if (imageData.data[i + 3] > maiores[3]) { maiores[3] = imageData.data[i + 3] }
    if (imageData.data[i] < menores[0]) { menores[0] = imageData.data[i] }
    if (imageData.data[i + 1] < menores[1]) { menores[1] = imageData.data[i + 1] }
    if (imageData.data[i + 2] < menores[2]) { menores[2] = imageData.data[i + 2] }
    if (imageData.data[i + 3] < menores[3]) { menores[3] = imageData.data[i + 3] }
  }

  for (let i = 0; i < imgData.data.length; i += 4) {
    if (imageData.data[i] > 255) {
      imageData.data[i] = (255 / (maiores[0] - menores[0])) * (imageData.data[i] - menores[0])
    }
    if (imageData.data[i + 1] > 255) {
      imageData.data[i + 1] = (255 / (maiores[1] - menores[1])) * (imageData.data[i + 1] - menores[1])
    }
    if (imageData.data[i + 2] > 255) {
      imageData.data[i + 2] = (255 / (maiores[2] - menores[2])) * (imageData.data[i + 2] - menores[2])
    }
    if (imageData.data[i + 3] > 255) {
      imageData.data[i + 3] = (255 / (maiores[3] - menores[3])) * (imageData.data[i + 3] - menores[3])
    }
  }

  return imageData
}