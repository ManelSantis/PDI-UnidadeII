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

//MEDIA 3X3
const media3 = document.getElementById('media3')
const media3x3 = document.getElementById('media3x3')
const m3 = media3x3.getContext('2d')
let m3img = new Image

media3.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let count = 0

  for (let y = 1; y <= srcImage.height - 1; y++) {
    for (let x = 1; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 1, y - 1)
      var v1 = getPixelIndex(x, y - 1)
      var v2 = getPixelIndex(x + 1, y - 1)
      var v3 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v5 = getPixelIndex(x + 1, y)
      var v6 = getPixelIndex(x - 1, y + 1)
      var v7 = getPixelIndex(x, y + 1)
      var v8 = getPixelIndex(x + 1, y + 1)

      var mediaR = (imgData.data[v0] + imgData.data[v1] + imgData.data[v2] + imgData.data[v3] +
        imgData.data[pixel] + imgData.data[v5] + imgData.data[v6] + imgData.data[v7] + imgData.data[v8]) / 9
      var mediaG = (imgData.data[v0 + 1] + imgData.data[v1 + 1] + imgData.data[v2 + 1] + imgData.data[v3 + 1] +
        imgData.data[pixel + 1] + imgData.data[v5 + 1] + imgData.data[v6 + 1] + imgData.data[v7 + 1] + imgData.data[v8 + 1]) / 9
      var mediaB = (imgData.data[v0 + 2] + imgData.data[v1 + 2] + imgData.data[v2 + 2] + imgData.data[v3 + 2] +
        imgData.data[pixel + 2] + imgData.data[v5 + 2] + imgData.data[v6 + 2] + imgData.data[v7 + 2] + imgData.data[v8 + 2]) / 9

      reds.push(mediaR)
      greens.push(mediaG)
      blues.push(mediaB)
      count++
    }
  }

  console.log(count)
  console.log(reds.length)
  console.log(newImgData.data.length / 4)


  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  m3img = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  media3x3.width = m3img.width
  media3x3.height = m3img.height
  m3.drawImage(m3img, 0, 0, m3img.width, m3img.height)

}

//MEDIA 5X5
const media5 = document.getElementById('media5')
const media5x5 = document.getElementById('media5x5')
const m5 = media5x5.getContext('2d')
let m5img = new Image

media5.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 2, srcImage.height - 2)
  let reds = []
  let greens = []
  let blues = []

  let count = 0

  for (let y = 2; y <= srcImage.height - 1; y++) {
    for (let x = 2; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 2, y - 2)
      var v1 = getPixelIndex(x - 1, y - 2)
      var v2 = getPixelIndex(x, y - 2)
      var v3 = getPixelIndex(x + 1, y - 2)
      var v4 = getPixelIndex(x + 2, y - 2)
      var v5 = getPixelIndex(x - 2, y - 1)
      var v6 = getPixelIndex(x - 1, y - 1)
      var v7 = getPixelIndex(x, y - 1)
      var v8 = getPixelIndex(x + 1, y - 1)
      var v9 = getPixelIndex(x + 2, y - 1)
      var v10 = getPixelIndex(x - 2, y)
      var v11 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v13 = getPixelIndex(x + 1, y)
      var v14 = getPixelIndex(x + 2, y)
      var v15 = getPixelIndex(x - 2, y + 1)
      var v16 = getPixelIndex(x - 1, y + 1)
      var v17 = getPixelIndex(x, y + 1)
      var v18 = getPixelIndex(x + 1, y + 1)
      var v19 = getPixelIndex(x + 2, y + 1)
      var v20 = getPixelIndex(x - 2, y + 2)
      var v21 = getPixelIndex(x - 1, y + 2)
      var v22 = getPixelIndex(x, y + 2)
      var v23 = getPixelIndex(x + 1, y + 2)
      var v24 = getPixelIndex(x + 2, y + 2)

      let mediaR = (imgData.data[v0] + imgData.data[v1] + imgData.data[v2] + imgData.data[v3] + imgData.data[v4] +
        imgData.data[v5] + imgData.data[v6] + imgData.data[v7] + imgData.data[v8] + imgData.data[v9] +
        imgData.data[v10] + imgData.data[v11] + imgData.data[pixel] + imgData.data[v13] + imgData.data[v14] +
        imgData.data[v15] + imgData.data[v16] + imgData.data[v17] + imgData.data[v18] + imgData.data[v19] +
        imgData.data[v20] + imgData.data[v21] + imgData.data[v22] + imgData.data[v23] + imgData.data[v24]) / 25

      let mediaG = (imgData.data[v0 + 1] + imgData.data[v1 + 1] + imgData.data[v2 + 1] + imgData.data[v3 + 1] + imgData.data[v4 + 1] +
        imgData.data[v5 + 1] + imgData.data[v6 + 1] + imgData.data[v7 + 1] + imgData.data[v8 + 1] + imgData.data[v9 + 1] +
        imgData.data[v10 + 1] + imgData.data[v11 + 1] + imgData.data[pixel + 1] + imgData.data[v13 + 1] + imgData.data[v14 + 1] +
        imgData.data[v15 + 1] + imgData.data[v16 + 1] + imgData.data[v17 + 1] + imgData.data[v18 + 1] + imgData.data[v19 + 1] +
        imgData.data[v20 + 1] + imgData.data[v21 + 1] + imgData.data[v22 + 1] + imgData.data[v23 + 1] + imgData.data[v24 + 1]) / 25

      let mediaB = (imgData.data[v0 + 2] + imgData.data[v1 + 2] + imgData.data[v2 + 2] + imgData.data[v3 + 2] + imgData.data[v4 + 2] +
        imgData.data[v5 + 2] + imgData.data[v6 + 2] + imgData.data[v7 + 2] + imgData.data[v8 + 2] + imgData.data[v9 + 2] +
        imgData.data[v10 + 2] + imgData.data[v11 + 2] + imgData.data[pixel + 2] + imgData.data[v13 + 2] + imgData.data[v14 + 2] +
        imgData.data[v15 + 2] + imgData.data[v16 + 2] + imgData.data[v17 + 2] + imgData.data[v18 + 2] + imgData.data[v19 + 2] +
        imgData.data[v20 + 2] + imgData.data[v21 + 2] + imgData.data[v22 + 2] + imgData.data[v23 + 2] + imgData.data[v24 + 2]) / 25

      reds.push(mediaR)
      greens.push(mediaG)
      blues.push(mediaB)
      count++
    }
  }

  console.log(count)
  console.log(reds.length)
  console.log(newImgData.data.length / 4)

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  m5img = imgDataToImg(newImgData, srcImage.width - 2, srcImage.height - 2)
  media5x5.width = m5img.width
  media5x5.height = m5img.height
  m5.drawImage(m5img, 0, 0, m5img.width, m5img.height)

}

//MEDIANA 3X3
const mediana3 = document.getElementById('mediana3')
const mediana3x3 = document.getElementById('mediana3x3')
const mn3 = mediana3x3.getContext('2d')
let mn3img = new Image

mediana3.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let count = 0

  for (let y = 1; y <= srcImage.height - 1; y++) {
    for (let x = 1; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 1, y - 1)
      var v1 = getPixelIndex(x, y - 1)
      var v2 = getPixelIndex(x + 1, y - 1)
      var v3 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v5 = getPixelIndex(x + 1, y)
      var v6 = getPixelIndex(x - 1, y + 1)
      var v7 = getPixelIndex(x, y + 1)
      var v8 = getPixelIndex(x + 1, y + 1)

      var vetorR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var vetorG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var vetorB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var medianaR = calcularMediana(vetorR)
      var medianaG = calcularMediana(vetorG)
      var medianaB = calcularMediana(vetorB)

      reds.push(medianaR)
      greens.push(medianaG)
      blues.push(medianaB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  mn3img = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  mediana3x3.width = mn3img.width
  mediana3x3.height = mn3img.height
  mn3.drawImage(mn3img, 0, 0, mn3img.width, mn3img.height)

}

//MEDIANA 5X5
const mediana5 = document.getElementById('mediana5')
const mediana5x5 = document.getElementById('mediana5x5')
const mn5 = mediana5x5.getContext('2d')
let mn5img = new Image

mediana5.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 2, srcImage.height - 2)
  let reds = []
  let greens = []
  let blues = []

  let count = 0

  for (let y = 2; y <= srcImage.height - 1; y++) {
    for (let x = 2; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 2, y - 2)
      var v1 = getPixelIndex(x - 1, y - 2)
      var v2 = getPixelIndex(x, y - 2)
      var v3 = getPixelIndex(x + 1, y - 2)
      var v4 = getPixelIndex(x + 2, y - 2)
      var v5 = getPixelIndex(x - 2, y - 1)
      var v6 = getPixelIndex(x - 1, y - 1)
      var v7 = getPixelIndex(x, y - 1)
      var v8 = getPixelIndex(x + 1, y - 1)
      var v9 = getPixelIndex(x + 2, y - 1)
      var v10 = getPixelIndex(x - 2, y)
      var v11 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v13 = getPixelIndex(x + 1, y)
      var v14 = getPixelIndex(x + 2, y)
      var v15 = getPixelIndex(x - 2, y + 1)
      var v16 = getPixelIndex(x - 1, y + 1)
      var v17 = getPixelIndex(x, y + 1)
      var v18 = getPixelIndex(x + 1, y + 1)
      var v19 = getPixelIndex(x + 2, y + 1)
      var v20 = getPixelIndex(x - 2, y + 2)
      var v21 = getPixelIndex(x - 1, y + 2)
      var v22 = getPixelIndex(x, y + 2)
      var v23 = getPixelIndex(x + 1, y + 2)
      var v24 = getPixelIndex(x + 2, y + 2)

      let vetorR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3], imgData.data[v4],
      imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8], imgData.data[v9],
      imgData.data[v10], imgData.data[v11], imgData.data[pixel], imgData.data[v13], imgData.data[v14],
      imgData.data[v15], imgData.data[v16], imgData.data[v17], imgData.data[v18], imgData.data[v19],
      imgData.data[v20], imgData.data[v21], imgData.data[v22], imgData.data[v23], imgData.data[v24]]

      let vetorG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1], imgData.data[v4 + 1],
      imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1], imgData.data[v9 + 1],
      imgData.data[v10 + 1], imgData.data[v11 + 1], imgData.data[pixel + 1], imgData.data[v13 + 1], imgData.data[v14 + 1],
      imgData.data[v15 + 1], imgData.data[v16 + 1], imgData.data[v17 + 1], imgData.data[v18 + 1], imgData.data[v19 + 1],
      imgData.data[v20 + 1], imgData.data[v21 + 1], imgData.data[v22 + 1], imgData.data[v23 + 1], imgData.data[v24 + 1]]

      let vetorB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2], imgData.data[v4 + 2],
      imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2], imgData.data[v9 + 2],
      imgData.data[v10 + 2], imgData.data[v11 + 2], imgData.data[pixel + 2], imgData.data[v13 + 2], imgData.data[v14 + 2],
      imgData.data[v15 + 2], imgData.data[v16 + 2], imgData.data[v17 + 2], imgData.data[v18 + 2], imgData.data[v19 + 2],
      imgData.data[v20 + 2], imgData.data[v21 + 2], imgData.data[v22 + 2], imgData.data[v23 + 2], imgData.data[v24 + 2]]

      var medianaR = calcularMediana(vetorR)
      var medianaG = calcularMediana(vetorG)
      var medianaB = calcularMediana(vetorB)

      reds.push(medianaR)
      greens.push(medianaG)
      blues.push(medianaB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  mn5img = imgDataToImg(newImgData, srcImage.width - 2, srcImage.height - 2)
  mediana5x5.width = mn5img.width
  mediana5x5.height = mn5img.height
  mn5.drawImage(mn5img, 0, 0, mn5img.width, mn5img.height)

}

//MAXIMO
const maximo = document.getElementById('maximo')
const max = document.getElementById('max')
const ma = max.getContext('2d')
let maimg = new Image

maximo.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  for (let y = 1; y <= srcImage.height - 1; y++) {
    for (let x = 1; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 1, y - 1)
      var v1 = getPixelIndex(x, y - 1)
      var v2 = getPixelIndex(x + 1, y - 1)
      var v3 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v5 = getPixelIndex(x + 1, y)
      var v6 = getPixelIndex(x - 1, y + 1)
      var v7 = getPixelIndex(x, y + 1)
      var v8 = getPixelIndex(x + 1, y + 1)

      var vetorR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var vetorG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var vetorB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var maxR = calcularMaximo(vetorR)
      var maxG = calcularMaximo(vetorG)
      var maxB = calcularMaximo(vetorB)

      reds.push(maxR)
      greens.push(maxG)
      blues.push(maxB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  maimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  max.width = maimg.width
  max.height = maimg.height
  ma.drawImage(maimg, 0, 0, maimg.width, maimg.height)

}

//MINIMO
const minimo = document.getElementById('minimo')
const min = document.getElementById('min')
const mi = min.getContext('2d')
let miimg = new Image

minimo.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  for (let y = 1; y <= srcImage.height - 1; y++) {
    for (let x = 1; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 1, y - 1)
      var v1 = getPixelIndex(x, y - 1)
      var v2 = getPixelIndex(x + 1, y - 1)
      var v3 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v5 = getPixelIndex(x + 1, y)
      var v6 = getPixelIndex(x - 1, y + 1)
      var v7 = getPixelIndex(x, y + 1)
      var v8 = getPixelIndex(x + 1, y + 1)

      var vetorR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var vetorG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var vetorB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var minR = calcularMinimo(vetorR)
      var minG = calcularMinimo(vetorG)
      var minB = calcularMinimo(vetorB)

      reds.push(minR)
      greens.push(minG)
      blues.push(minB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  miimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  min.width = miimg.width
  min.height = miimg.height
  mi.drawImage(miimg, 0, 0, miimg.width, miimg.height)
}

//MODA
const moda = document.getElementById('moda')
const mode = document.getElementById('mode')
const mo = mode.getContext('2d')
let moimg = new Image

moda.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  for (let y = 1; y <= srcImage.height - 1; y++) {
    for (let x = 1; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 1, y - 1)
      var v1 = getPixelIndex(x, y - 1)
      var v2 = getPixelIndex(x + 1, y - 1)
      var v3 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v5 = getPixelIndex(x + 1, y)
      var v6 = getPixelIndex(x - 1, y + 1)
      var v7 = getPixelIndex(x, y + 1)
      var v8 = getPixelIndex(x + 1, y + 1)

      var vetorR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var vetorG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var vetorB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var moR = calcularModa(vetorR)
      var moG = calcularModa(vetorG)
      var moB = calcularModa(vetorB)

      reds.push(moR)
      greens.push(moG)
      blues.push(moB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  moimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  mode.width = moimg.width
  mode.height = moimg.height
  mo.drawImage(moimg, 0, 0, moimg.width, moimg.height)
}

//KUWAHARA
const kuwahara = document.getElementById('kuwahara')
const kuwa = document.getElementById('kuwa')
const ku = kuwa.getContext('2d')
let kuimg = new Image

kuwahara.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 2, srcImage.height - 2)
  let reds = []
  let greens = []
  let blues = []

  for (let y = 2; y <= srcImage.height - 1; y++) {
    for (let x = 2; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 2, y - 2)
      var v1 = getPixelIndex(x - 1, y - 2)
      var v2 = getPixelIndex(x, y - 2)
      var v3 = getPixelIndex(x + 1, y - 2)
      var v4 = getPixelIndex(x + 2, y - 2)
      var v5 = getPixelIndex(x - 2, y - 1)
      var v6 = getPixelIndex(x - 1, y - 1)
      var v7 = getPixelIndex(x, y - 1)
      var v8 = getPixelIndex(x + 1, y - 1)
      var v9 = getPixelIndex(x + 2, y - 1)
      var v10 = getPixelIndex(x - 2, y)
      var v11 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v13 = getPixelIndex(x + 1, y)
      var v14 = getPixelIndex(x + 2, y)
      var v15 = getPixelIndex(x - 2, y + 1)
      var v16 = getPixelIndex(x - 1, y + 1)
      var v17 = getPixelIndex(x, y + 1)
      var v18 = getPixelIndex(x + 1, y + 1)
      var v19 = getPixelIndex(x + 2, y + 1)
      var v20 = getPixelIndex(x - 2, y + 2)
      var v21 = getPixelIndex(x - 1, y + 2)
      var v22 = getPixelIndex(x, y + 2)
      var v23 = getPixelIndex(x + 1, y + 2)
      var v24 = getPixelIndex(x + 2, y + 2)

      //Médias de R
      var red1 = [imgData.data[v0],imgData.data[v1],imgData.data[v2],imgData.data[v5],
      imgData.data[v6],imgData.data[v7],imgData.data[v10],imgData.data[v11],imgData.data[pixel]]
      
      var red2 = [imgData.data[v2],imgData.data[v3],imgData.data[v4],imgData.data[v7],
      imgData.data[v8],imgData.data[v9],imgData.data[pixel],imgData.data[v13],imgData.data[v14]]
      
      var red3 = [imgData.data[v10],imgData.data[v11],imgData.data[pixel],imgData.data[v15],
      imgData.data[v16],imgData.data[v17],imgData.data[v20],imgData.data[v21],imgData.data[v22]]
      
      var red4 = [imgData.data[pixel],imgData.data[v13],imgData.data[v14],imgData.data[v17],
      imgData.data[v18],imgData.data[v19],imgData.data[v22],imgData.data[v23],imgData.data[v24]]

      var mediasR = [calcularMedia(red1), calcularMedia(red2), calcularMedia(red3), calcularMedia(red4)]

      var varianciasR = [calcularVariancia(red1), calcularVariancia(red2), calcularVariancia(red3), calcularVariancia(red4)]
      var kuwaR = mediasR[calcularMinimoVariancia(varianciasR)]

      //Médias de Green
      var green1 = [imgData.data[v0+1] ,imgData.data[v1+1] ,imgData.data[v2+1] ,imgData.data[v5+1] ,
      imgData.data[v6+1] ,imgData.data[v7+1] ,imgData.data[v10+1] ,imgData.data[v11+1] ,imgData.data[pixel+1] ]
      
      var green2 = [imgData.data[v2+1] ,imgData.data[v3+1] ,imgData.data[v4+1] ,imgData.data[v7+1] ,
      imgData.data[v8+1] ,imgData.data[v9+1] ,imgData.data[pixel+1] ,imgData.data[v13+1] ,imgData.data[v14+1] ]
      
      var green3 = [imgData.data[v10+1] ,imgData.data[v11+1] ,imgData.data[pixel+1] ,imgData.data[v15+1] ,
      imgData.data[v16+1] ,imgData.data[v17+1] ,imgData.data[v20+1] ,imgData.data[v21+1] ,imgData.data[v22+1] ]
      
      var green4 = [imgData.data[pixel+1] ,imgData.data[v13+1] ,imgData.data[v14+1] ,imgData.data[v17+1] ,
      imgData.data[v18+1] ,imgData.data[v19+1] ,imgData.data[v22+1] ,imgData.data[v23+1] ,imgData.data[v24+1] ]

      var mediasG = [calcularMedia(green1), calcularMedia(green2), calcularMedia(green3), calcularMedia(green4)]

      var varianciasG = [calcularVariancia(green1), calcularVariancia(green2), calcularVariancia(green3), calcularVariancia(green4)]
      var kuwaG = mediasG[calcularMinimoVariancia(varianciasG)]

      //Médias de Blue
      var blue1 = [imgData.data[v0+2] ,imgData.data[v1+2] ,imgData.data[v2+2] ,imgData.data[v5+2] ,
      imgData.data[v6+2] ,imgData.data[v7+2] ,imgData.data[v10+2] ,imgData.data[v11+2] ,imgData.data[pixel+2] ]
      
      var blue2 = [imgData.data[v2+2] ,imgData.data[v3+2] ,imgData.data[v4+2] ,imgData.data[v7+2] ,
      imgData.data[v8+2] ,imgData.data[v9+2] ,imgData.data[pixel+2] ,imgData.data[v13+2] ,imgData.data[v14+2] ]
      
      var blue3 = [imgData.data[v10+2] ,imgData.data[v11+2] ,imgData.data[pixel+2] ,imgData.data[v15+2] ,
      imgData.data[v16+2] ,imgData.data[v17+2] ,imgData.data[v20+2] ,imgData.data[v21+2] ,imgData.data[v22+2] ]
      
      var blue4 = [imgData.data[pixel+2] ,imgData.data[v13+2] ,imgData.data[v14+2] ,imgData.data[v17+2] ,
      imgData.data[v18+2] ,imgData.data[v19+2] ,imgData.data[v22+2] ,imgData.data[v23+2] ,imgData.data[v24+2] ]

      var mediasB = [calcularMedia(blue1), calcularMedia(blue2), calcularMedia(blue3), calcularMedia(blue4)]

      var varianciasB = [calcularVariancia(blue1), calcularVariancia(blue2), calcularVariancia(blue3), calcularVariancia(blue4)]
      var kuwaB = mediasB[calcularMinimoVariancia(varianciasB)]

      reds.push(kuwaR)
      greens.push(kuwaG)
      blues.push(kuwaB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  console.log(newImgData.data)

  kuimg = imgDataToImg(newImgData, srcImage.width - 2, srcImage.height - 2)
  kuwa.width = kuimg.width
  kuwa.height = kuimg.height
  ku.drawImage(kuimg, 0, 0, kuimg.width, kuimg.height)

}

//TOMITA E TOTSU
const totsu = document.getElementById('totsu')
const tt = document.getElementById('tt')
const to = tt.getContext('2d')
let toimg = new Image

totsu.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 2, srcImage.height - 2)
  let reds = []
  let greens = []
  let blues = []

  for (let y = 2; y <= srcImage.height - 1; y++) {
    for (let x = 2; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 2, y - 2)
      var v1 = getPixelIndex(x - 1, y - 2)
      var v2 = getPixelIndex(x, y - 2)
      var v3 = getPixelIndex(x + 1, y - 2)
      var v4 = getPixelIndex(x + 2, y - 2)
      var v5 = getPixelIndex(x - 2, y - 1)
      var v6 = getPixelIndex(x - 1, y - 1)
      var v7 = getPixelIndex(x, y - 1)
      var v8 = getPixelIndex(x + 1, y - 1)
      var v9 = getPixelIndex(x + 2, y - 1)
      var v10 = getPixelIndex(x - 2, y)
      var v11 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v13 = getPixelIndex(x + 1, y)
      var v14 = getPixelIndex(x + 2, y)
      var v15 = getPixelIndex(x - 2, y + 1)
      var v16 = getPixelIndex(x - 1, y + 1)
      var v17 = getPixelIndex(x, y + 1)
      var v18 = getPixelIndex(x + 1, y + 1)
      var v19 = getPixelIndex(x + 2, y + 1)
      var v20 = getPixelIndex(x - 2, y + 2)
      var v21 = getPixelIndex(x - 1, y + 2)
      var v22 = getPixelIndex(x, y + 2)
      var v23 = getPixelIndex(x + 1, y + 2)
      var v24 = getPixelIndex(x + 2, y + 2)

      //Médias de R
      var red1 = [imgData.data[v0],imgData.data[v1],imgData.data[v2],imgData.data[v5],
      imgData.data[v6],imgData.data[v7],imgData.data[v10],imgData.data[v11],imgData.data[pixel]]
      
      var red2 = [imgData.data[v2],imgData.data[v3],imgData.data[v4],imgData.data[v7],
      imgData.data[v8],imgData.data[v9],imgData.data[pixel],imgData.data[v13],imgData.data[v14]]
      
      var red3 = [imgData.data[v10],imgData.data[v11],imgData.data[pixel],imgData.data[v15],
      imgData.data[v16],imgData.data[v17],imgData.data[v20],imgData.data[v21],imgData.data[v22]]
      
      var red4 = [imgData.data[pixel],imgData.data[v13],imgData.data[v14],imgData.data[v17],
      imgData.data[v18],imgData.data[v19],imgData.data[v22],imgData.data[v23],imgData.data[v24]]

      var red5 = [imgData.data[v6],imgData.data[v7],imgData.data[v8],imgData.data[v11],
      imgData.data[pixel],imgData.data[v13],imgData.data[v16],imgData.data[v17],imgData.data[v18]]

      var mediasR = [calcularMedia(red1), calcularMedia(red2), calcularMedia(red3), calcularMedia(red4), calcularMedia(red5)]

      var varianciasR = [calcularVariancia(red1), calcularVariancia(red2), calcularVariancia(red3), calcularVariancia(red4), calcularVariancia(red5)]
      var kuwaR = mediasR[calcularMinimoVariancia(varianciasR)]

      //Médias de Green
      var green1 = [imgData.data[v0+1] ,imgData.data[v1+1] ,imgData.data[v2+1] ,imgData.data[v5+1] ,
      imgData.data[v6+1] ,imgData.data[v7+1] ,imgData.data[v10+1] ,imgData.data[v11+1] ,imgData.data[pixel+1] ]
      
      var green2 = [imgData.data[v2+1] ,imgData.data[v3+1] ,imgData.data[v4+1] ,imgData.data[v7+1] ,
      imgData.data[v8+1] ,imgData.data[v9+1] ,imgData.data[pixel+1] ,imgData.data[v13+1] ,imgData.data[v14+1] ]
      
      var green3 = [imgData.data[v10+1] ,imgData.data[v11+1] ,imgData.data[pixel+1] ,imgData.data[v15+1] ,
      imgData.data[v16+1] ,imgData.data[v17+1] ,imgData.data[v20+1] ,imgData.data[v21+1] ,imgData.data[v22+1] ]
      
      var green4 = [imgData.data[pixel+1] ,imgData.data[v13+1] ,imgData.data[v14+1] ,imgData.data[v17+1] ,
      imgData.data[v18+1] ,imgData.data[v19+1] ,imgData.data[v22+1] ,imgData.data[v23+1] ,imgData.data[v24+1] ]

      var green5 = [imgData.data[v6+1],imgData.data[v7+1],imgData.data[v8+1],imgData.data[v11+1],
      imgData.data[pixel+1],imgData.data[v13+1],imgData.data[v16+1],imgData.data[v17+1],imgData.data[v18+1]]

      var mediasG = [calcularMedia(green1), calcularMedia(green2), calcularMedia(green3), calcularMedia(green4), calcularMedia(green5)]

      var varianciasG = [calcularVariancia(green1), calcularVariancia(green2), calcularVariancia(green3), calcularVariancia(green4), calcularVariancia(green5)]
      var kuwaG = mediasG[calcularMinimoVariancia(varianciasG)]

      //Médias de Blue
      var blue1 = [imgData.data[v0+2] ,imgData.data[v1+2] ,imgData.data[v2+2] ,imgData.data[v5+2] ,
      imgData.data[v6+2] ,imgData.data[v7+2] ,imgData.data[v10+2] ,imgData.data[v11+2] ,imgData.data[pixel+2] ]
      
      var blue2 = [imgData.data[v2+2] ,imgData.data[v3+2] ,imgData.data[v4+2] ,imgData.data[v7+2] ,
      imgData.data[v8+2] ,imgData.data[v9+2] ,imgData.data[pixel+2] ,imgData.data[v13+2] ,imgData.data[v14+2] ]
      
      var blue3 = [imgData.data[v10+2] ,imgData.data[v11+2] ,imgData.data[pixel+2] ,imgData.data[v15+2] ,
      imgData.data[v16+2] ,imgData.data[v17+2] ,imgData.data[v20+2] ,imgData.data[v21+2] ,imgData.data[v22+2] ]
      
      var blue4 = [imgData.data[pixel+2] ,imgData.data[v13+2] ,imgData.data[v14+2] ,imgData.data[v17+2] ,
      imgData.data[v18+2] ,imgData.data[v19+2] ,imgData.data[v22+2] ,imgData.data[v23+2] ,imgData.data[v24+2] ]

      var blue5 = [imgData.data[v6+2],imgData.data[v7+2],imgData.data[v8+2],imgData.data[v11+2],
      imgData.data[pixel+2],imgData.data[v13+2],imgData.data[v16+2],imgData.data[v17+2],imgData.data[v18+2]]

      var mediasB = [calcularMedia(blue1), calcularMedia(blue2), calcularMedia(blue3), calcularMedia(blue4), calcularMedia(blue5)]

      var varianciasB = [calcularVariancia(blue1), calcularVariancia(blue2), calcularVariancia(blue3), calcularVariancia(blue4), calcularVariancia(blue5)]
      var kuwaB = mediasB[calcularMinimoVariancia(varianciasB)]

      reds.push(kuwaR)
      greens.push(kuwaG)
      blues.push(kuwaB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  console.log(newImgData.data)

  toimg = imgDataToImg(newImgData, srcImage.width - 2, srcImage.height - 2)
  tt.width = toimg.width
  tt.height = toimg.height
  to.drawImage(toimg, 0, 0, toimg.width, toimg.height)

}

//NAGAO E MATSUYAMA
const nagao = document.getElementById('nagao')
const nm = document.getElementById('nm')
const mn = nm.getContext('2d')
let nmimg = new Image

nagao.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 2, srcImage.height - 2)
  let reds = []
  let greens = []
  let blues = []

  for (let y = 2; y <= srcImage.height - 1; y++) {
    for (let x = 2; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 2, y - 2)
      var v1 = getPixelIndex(x - 1, y - 2)
      var v2 = getPixelIndex(x, y - 2)
      var v3 = getPixelIndex(x + 1, y - 2)
      var v4 = getPixelIndex(x + 2, y - 2)
      var v5 = getPixelIndex(x - 2, y - 1)
      var v6 = getPixelIndex(x - 1, y - 1)
      var v7 = getPixelIndex(x, y - 1)
      var v8 = getPixelIndex(x + 1, y - 1)
      var v9 = getPixelIndex(x + 2, y - 1)
      var v10 = getPixelIndex(x - 2, y)
      var v11 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v13 = getPixelIndex(x + 1, y)
      var v14 = getPixelIndex(x + 2, y)
      var v15 = getPixelIndex(x - 2, y + 1)
      var v16 = getPixelIndex(x - 1, y + 1)
      var v17 = getPixelIndex(x, y + 1)
      var v18 = getPixelIndex(x + 1, y + 1)
      var v19 = getPixelIndex(x + 2, y + 1)
      var v20 = getPixelIndex(x - 2, y + 2)
      var v21 = getPixelIndex(x - 1, y + 2)
      var v22 = getPixelIndex(x, y + 2)
      var v23 = getPixelIndex(x + 1, y + 2)
      var v24 = getPixelIndex(x + 2, y + 2)

      //Médias de R
      var red1 = [imgData.data[v6],imgData.data[v7],imgData.data[v8],imgData.data[v11],
      imgData.data[pixel],imgData.data[v13],imgData.data[v16],imgData.data[v17],imgData.data[v18]]

      var red2 = [imgData.data[v1], imgData.data[v2], imgData.data[v3], imgData.data[v6],
      imgData.data[v7], imgData.data[v8], imgData.data[pixel]]

      var red3 = [imgData.data[v8], imgData.data[v9], imgData.data[v13], imgData.data[v14],
      imgData.data[v18], imgData.data[v19], imgData.data[pixel]]

      var red4 = [imgData.data[v16], imgData.data[v17], imgData.data[v18], imgData.data[v21],
      imgData.data[v22], imgData.data[v23], imgData.data[pixel]]

      var red5 = [imgData.data[v5], imgData.data[v6], imgData.data[v10], imgData.data[v11],
      imgData.data[v15], imgData.data[v16], imgData.data[pixel]]

      var red6 = [imgData.data[v0], imgData.data[v1], imgData.data[v5], imgData.data[v6],
      imgData.data[v7], imgData.data[v11], imgData.data[pixel]]

      var red7 = [imgData.data[v3], imgData.data[v4], imgData.data[v7], imgData.data[v8],
      imgData.data[v9], imgData.data[v13], imgData.data[pixel]]

      var red8 = [imgData.data[v13], imgData.data[v17], imgData.data[v18], imgData.data[v19],
      imgData.data[v23], imgData.data[v24], imgData.data[pixel]]

      var red9 = [imgData.data[v11], imgData.data[v15], imgData.data[v16], imgData.data[v17],
      imgData.data[v20], imgData.data[v21], imgData.data[pixel]]

      var mediasR = [calcularMedia(red1), calcularMedia(red2), calcularMedia(red3), calcularMedia(red4), 
        calcularMedia(red5), calcularMedia(red6), calcularMedia(red7), calcularMedia(red8), calcularMedia(red9)]

      var varianciasR = [calcularVariancia(red1), calcularVariancia(red2), calcularVariancia(red3), calcularVariancia(red4), 
        calcularVariancia(red5), calcularVariancia(red6), calcularVariancia(red7), calcularVariancia(red8), calcularVariancia(red9)]

      var kuwaR = mediasR[calcularMinimoVariancia(varianciasR)]

      //Médias de Green
      var green1 = [imgData.data[v6+1],imgData.data[v7+1],imgData.data[v8+1],imgData.data[v11+1],
      imgData.data[pixel+1],imgData.data[v13+1],imgData.data[v16+1],imgData.data[v17+1],imgData.data[v18+1]]

      var green2 = [imgData.data[v1+1], imgData.data[v2+1], imgData.data[v3+1], imgData.data[v6+1],
      imgData.data[v7+1], imgData.data[v8+1], imgData.data[pixel+1]]

      var green3 = [imgData.data[v8+1], imgData.data[v9+1], imgData.data[v13+1], imgData.data[v14+1],
      imgData.data[v18+1], imgData.data[v19+1], imgData.data[pixel+1]]

      var green4 = [imgData.data[v16+1], imgData.data[v17+1], imgData.data[v18+1], imgData.data[v21+1],
      imgData.data[v22+1], imgData.data[v23+1], imgData.data[pixel+1]]

      var green5 = [imgData.data[v5+1], imgData.data[v6+1], imgData.data[v10+1], imgData.data[v11+1],
      imgData.data[v15+1], imgData.data[v16+1], imgData.data[pixel+1]]

      var green6 = [imgData.data[v0+1], imgData.data[v1+1], imgData.data[v5+1], imgData.data[v6+1],
      imgData.data[v7+1], imgData.data[v11+1], imgData.data[pixel+1]]

      var green7 = [imgData.data[v3+1], imgData.data[v4+1], imgData.data[v7+1], imgData.data[v8+1],
      imgData.data[v9+1], imgData.data[v13+1], imgData.data[pixel+1]]

      var green8 = [imgData.data[v13+1], imgData.data[v17+1], imgData.data[v18+1], imgData.data[v19+1],
      imgData.data[v23+1], imgData.data[v24+1], imgData.data[pixel+1]]

      var green9 = [imgData.data[v11+1], imgData.data[v15+1], imgData.data[v16+1], imgData.data[v17+1],
      imgData.data[v20+1], imgData.data[v21+1], imgData.data[pixel+1]]

      var mediasG = [calcularMedia(green1), calcularMedia(green2), calcularMedia(green3), calcularMedia(green4), 
        calcularMedia(green5), calcularMedia(green6), calcularMedia(green7), calcularMedia(green8), calcularMedia(green9)]

      var varianciasG = [calcularVariancia(green1), calcularVariancia(green2), calcularVariancia(green3), calcularVariancia(green4), 
        calcularVariancia(green5), calcularVariancia(green6), calcularVariancia(green7), calcularVariancia(green8), calcularVariancia(green9)]
      var kuwaG = mediasG[calcularMinimoVariancia(varianciasG)]

      //Médias de Blue
      var blue1 = [imgData.data[v6+2],imgData.data[v7+2],imgData.data[v8+2],imgData.data[v11+2],
      imgData.data[pixel+2],imgData.data[v13+2],imgData.data[v16+2],imgData.data[v17+2],imgData.data[v18+2]]

      var blue2 = [imgData.data[v1+2], imgData.data[v2+2], imgData.data[v3+2], imgData.data[v6+2],
      imgData.data[v7+2], imgData.data[v8+2], imgData.data[pixel+2]]

      var blue3 = [imgData.data[v8+2], imgData.data[v9+2], imgData.data[v13+2], imgData.data[v14+2],
      imgData.data[v18+2], imgData.data[v19+2], imgData.data[pixel+2]]

      var blue4 = [imgData.data[v16+2], imgData.data[v17+2], imgData.data[v18+2], imgData.data[v21+2],
      imgData.data[v22+2], imgData.data[v23+2], imgData.data[pixel+2]]

      var blue5 = [imgData.data[v5+2], imgData.data[v6+2], imgData.data[v10+2], imgData.data[v11+2],
      imgData.data[v15+2], imgData.data[v16+2], imgData.data[pixel+2]]

      var blue6 = [imgData.data[v0+2], imgData.data[v1+2], imgData.data[v5+2], imgData.data[v6+2],
      imgData.data[v7+2], imgData.data[v11+2], imgData.data[pixel+2]]

      var blue7 = [imgData.data[v3+2], imgData.data[v4+2], imgData.data[v7+2], imgData.data[v8+2],
      imgData.data[v9+2], imgData.data[v13+2], imgData.data[pixel+2]]

      var blue8 = [imgData.data[v13+2], imgData.data[v17+2], imgData.data[v18+2], imgData.data[v19+2],
      imgData.data[v23+2], imgData.data[v24+2], imgData.data[pixel+2]]

      var blue9 = [imgData.data[v11+2], imgData.data[v15+2], imgData.data[v16+2], imgData.data[v17+2],
      imgData.data[v20+2], imgData.data[v21+2], imgData.data[pixel+2]]

      var mediasB = [calcularMedia(blue1), calcularMedia(blue2), calcularMedia(blue3), calcularMedia(blue4), 
        calcularMedia(blue5), calcularMedia(blue6), calcularMedia(blue7), calcularMedia(blue8), calcularMedia(blue9)]

      var varianciasB = [calcularVariancia(blue1), calcularVariancia(blue2), calcularVariancia(blue3), calcularVariancia(blue4), 
        calcularVariancia(blue5), calcularVariancia(blue6), calcularVariancia(blue7), calcularVariancia(blue8), calcularVariancia(blue9)]
      var kuwaB = mediasB[calcularMinimoVariancia(varianciasB)]

      reds.push(kuwaR)
      greens.push(kuwaG)
      blues.push(kuwaB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  console.log(newImgData.data)

  nmimg = imgDataToImg(newImgData, srcImage.width - 2, srcImage.height - 2)
  nm.width = nmimg.width
  nm.height = nmimg.height
  mn.drawImage(nmimg, 0, 0, nmimg.width, nmimg.height)

}

//SOMBOONKAEW
const somboonkaew = document.getElementById('somboonkaew')
const somboon = document.getElementById('somboon')
const sb = somboon.getContext('2d')
let sbimg = new Image

somboonkaew.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 2, srcImage.height - 2)
  let reds = []
  let greens = []
  let blues = []

  for (let y = 2; y <= srcImage.height - 1; y++) {
    for (let x = 2; x <= srcImage.width - 1; x++) {

      var v0 = getPixelIndex(x - 2, y - 2)
      var v1 = getPixelIndex(x - 1, y - 2)
      var v2 = getPixelIndex(x, y - 2)
      var v3 = getPixelIndex(x + 1, y - 2)
      var v4 = getPixelIndex(x + 2, y - 2)
      var v5 = getPixelIndex(x - 2, y - 1)
      var v6 = getPixelIndex(x - 1, y - 1)
      var v7 = getPixelIndex(x, y - 1)
      var v8 = getPixelIndex(x + 1, y - 1)
      var v9 = getPixelIndex(x + 2, y - 1)
      var v10 = getPixelIndex(x - 2, y)
      var v11 = getPixelIndex(x - 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v13 = getPixelIndex(x + 1, y)
      var v14 = getPixelIndex(x + 2, y)
      var v15 = getPixelIndex(x - 2, y + 1)
      var v16 = getPixelIndex(x - 1, y + 1)
      var v17 = getPixelIndex(x, y + 1)
      var v18 = getPixelIndex(x + 1, y + 1)
      var v19 = getPixelIndex(x + 2, y + 1)
      var v20 = getPixelIndex(x - 2, y + 2)
      var v21 = getPixelIndex(x - 1, y + 2)
      var v22 = getPixelIndex(x, y + 2)
      var v23 = getPixelIndex(x + 1, y + 2)
      var v24 = getPixelIndex(x + 2, y + 2)

      //Médias de R

      var red1 = [imgData.data[v0], imgData.data[v6], imgData.data[v18], 
      imgData.data[v24], imgData.data[v16], imgData.data[v8], imgData.data[pixel]]

      var red2 = [imgData.data[v4], imgData.data[v8], imgData.data[v16], 
      imgData.data[v20], imgData.data[v6], imgData.data[v18], imgData.data[pixel]]

      var red3 = [imgData.data[v10], imgData.data[v11], imgData.data[v13], 
      imgData.data[v14], imgData.data[v7], imgData.data[v17], imgData.data[pixel]]

      var red4 = [imgData.data[v2], imgData.data[v7], imgData.data[v17], 
      imgData.data[v22], imgData.data[v11], imgData.data[v13], imgData.data[pixel]]

      var red5 = [imgData.data[v6], imgData.data[v7], imgData.data[v8], 
      imgData.data[v16], imgData.data[v17], imgData.data[v18], imgData.data[pixel]]

      var red6 = [imgData.data[v6], imgData.data[v11], imgData.data[v16], 
      imgData.data[v8], imgData.data[v13], imgData.data[v18], imgData.data[pixel]]

      var red7 = [imgData.data[v6], imgData.data[v7], imgData.data[v11], 
      imgData.data[v13], imgData.data[v17], imgData.data[v18], imgData.data[pixel]]

      var red8 = [imgData.data[v7], imgData.data[v8], imgData.data[v13], 
      imgData.data[v11], imgData.data[v16], imgData.data[v17], imgData.data[pixel]]

      var red9 = [imgData.data[v7], imgData.data[v11], imgData.data[v13], 
      imgData.data[v16], imgData.data[v17], imgData.data[v18], imgData.data[pixel]]

      var red10 = [imgData.data[v13], imgData.data[v7], imgData.data[v17], 
      imgData.data[v6], imgData.data[v11], imgData.data[v16], imgData.data[pixel]]

      var red11 = [imgData.data[v6], imgData.data[v7], imgData.data[v8], 
      imgData.data[v11], imgData.data[v13], imgData.data[v17], imgData.data[pixel]]

      var red12 = [imgData.data[v7], imgData.data[v8], imgData.data[v13], 
      imgData.data[v17], imgData.data[v18], imgData.data[v11], imgData.data[pixel]]

      var mediasR = [calcularMedia(red1), calcularMedia(red2), calcularMedia(red3), calcularMedia(red4), 
        calcularMedia(red5), calcularMedia(red6), calcularMedia(red7), calcularMedia(red8), 
        calcularMedia(red9), calcularMedia(red10), calcularMedia(red11), calcularMedia(red12)]

      var varianciasR = [calcularVariancia(red1), calcularVariancia(red2), calcularVariancia(red3), calcularVariancia(red4), 
        calcularVariancia(red5), calcularVariancia(red6), calcularVariancia(red7), calcularVariancia(red8), 
        calcularVariancia(red9), calcularVariancia(red10), calcularVariancia(red11), calcularVariancia(red12)]

      var kuwaR = mediasR[calcularMinimoVariancia(varianciasR)]

      //Médias de Green

      var green1 = [imgData.data[v0+1], imgData.data[v6+1], imgData.data[v18+1], 
      imgData.data[v24+1], imgData.data[v16+1], imgData.data[v8+1], imgData.data[pixel+1]]

      var green2 = [imgData.data[v4+1], imgData.data[v8+1], imgData.data[v16+1], 
      imgData.data[v20+1], imgData.data[v6+1], imgData.data[v18+1], imgData.data[pixel+1]]

      var green3 = [imgData.data[v10+1], imgData.data[v11+1], imgData.data[v13+1], 
      imgData.data[v14+1], imgData.data[v7+1], imgData.data[v17+1], imgData.data[pixel+1]]

      var green4 = [imgData.data[v2+1], imgData.data[v7+1], imgData.data[v17+1], 
      imgData.data[v22+1], imgData.data[v11+1], imgData.data[v13+1], imgData.data[pixel+1]]

      var green5 = [imgData.data[v6+1], imgData.data[v7+1], imgData.data[v8+1], 
      imgData.data[v16+1], imgData.data[v17+1], imgData.data[v18+1], imgData.data[pixel+1]]

      var green6 = [imgData.data[v6+1], imgData.data[v11+1], imgData.data[v16+1], 
      imgData.data[v8+1], imgData.data[v13+1], imgData.data[v18+1], imgData.data[pixel+1]]

      var green7 = [imgData.data[v6+1], imgData.data[v7+1], imgData.data[v11+1], 
      imgData.data[v13+1], imgData.data[v17+1], imgData.data[v18+1], imgData.data[pixel+1]]

      var green8 = [imgData.data[v7+1], imgData.data[v8+1], imgData.data[v13+1], 
      imgData.data[v11+1], imgData.data[v16+1], imgData.data[v17+1], imgData.data[pixel+1]]

      var green9 = [imgData.data[v7+1], imgData.data[v11+1], imgData.data[v13+1], 
      imgData.data[v16+1], imgData.data[v17+1], imgData.data[v18+1], imgData.data[pixel+1]]

      var green10 = [imgData.data[v13+1], imgData.data[v7+1], imgData.data[v17+1], 
      imgData.data[v6+1], imgData.data[v11+1], imgData.data[v16+1], imgData.data[pixel+1]]

      var green11 = [imgData.data[v6+1], imgData.data[v7+1], imgData.data[v8+1], 
      imgData.data[v11+1], imgData.data[v13+1], imgData.data[v17+1], imgData.data[pixel+1]]

      var green12 = [imgData.data[v7+1], imgData.data[v8+1], imgData.data[v13+1], 
      imgData.data[v17+1], imgData.data[v18+1], imgData.data[v11+1], imgData.data[pixel+1]]

      var mediasG = [calcularMedia(green1), calcularMedia(green2), calcularMedia(green3), calcularMedia(green4), 
        calcularMedia(green5), calcularMedia(green6), calcularMedia(green7), calcularMedia(green8), 
        calcularMedia(green9), calcularMedia(green10), calcularMedia(green11), calcularMedia(green12)]

      var varianciasG = [calcularVariancia(green1), calcularVariancia(green2), calcularVariancia(green3), calcularVariancia(green4), 
        calcularVariancia(green5), calcularVariancia(green6), calcularVariancia(green7), calcularVariancia(green8), 
        calcularVariancia(green9), calcularVariancia(green10), calcularVariancia(green11), calcularVariancia(green12)]
      var kuwaG = mediasG[calcularMinimoVariancia(varianciasG)]

      //Médias de Blue

      var blue1 = [imgData.data[v0+2], imgData.data[v6+2], imgData.data[v18+2], 
      imgData.data[v24+2], imgData.data[v16+2], imgData.data[v8+2], imgData.data[pixel+2]]

      var blue2 = [imgData.data[v4+2], imgData.data[v8+2], imgData.data[v16+2], 
      imgData.data[v20+2], imgData.data[v6+2], imgData.data[v18+2], imgData.data[pixel+2]]

      var blue3 = [imgData.data[v10+2], imgData.data[v11+2], imgData.data[v13+2], 
      imgData.data[v14+2], imgData.data[v7+2], imgData.data[v17+2], imgData.data[pixel+2]]

      var blue4 = [imgData.data[v2+2], imgData.data[v7+2], imgData.data[v17+2], 
      imgData.data[v22+2], imgData.data[v11+2], imgData.data[v13+2], imgData.data[pixel+2]]

      var blue5 = [imgData.data[v6+2], imgData.data[v7+2], imgData.data[v8+2], 
      imgData.data[v16+2], imgData.data[v17+2], imgData.data[v18+2], imgData.data[pixel+2]]

      var blue6 = [imgData.data[v6+2], imgData.data[v11+2], imgData.data[v16+2], 
      imgData.data[v8+2], imgData.data[v13+2], imgData.data[v18+2], imgData.data[pixel+2]]

      var blue7 = [imgData.data[v6+2], imgData.data[v7+2], imgData.data[v11+2], 
      imgData.data[v13+2], imgData.data[v17+2], imgData.data[v18+2], imgData.data[pixel+2]]

      var blue8 = [imgData.data[v7+2], imgData.data[v8+2], imgData.data[v13+2], 
      imgData.data[v11+2], imgData.data[v16+2], imgData.data[v17+2], imgData.data[pixel+2]]

      var blue9 = [imgData.data[v7+2], imgData.data[v11+2], imgData.data[v13+2], 
      imgData.data[v16+2], imgData.data[v17+2], imgData.data[v18+2], imgData.data[pixel+2]]

      var blue10 = [imgData.data[v13+2], imgData.data[v7+2], imgData.data[v17+2], 
      imgData.data[v6+2], imgData.data[v11+2], imgData.data[v16+2], imgData.data[pixel+2]]

      var blue11 = [imgData.data[v6+2], imgData.data[v7+2], imgData.data[v8+2], 
      imgData.data[v11+2], imgData.data[v13+2], imgData.data[v17+2], imgData.data[pixel+2]]

      var blue12 = [imgData.data[v7+2], imgData.data[v8+2], imgData.data[v13+2], 
      imgData.data[v17+2], imgData.data[v18+2], imgData.data[v11+2], imgData.data[pixel+2]]

      var mediasB = [calcularMedia(blue1), calcularMedia(blue2), calcularMedia(blue3), calcularMedia(blue4), 
        calcularMedia(blue5), calcularMedia(blue6), calcularMedia(blue7), calcularMedia(blue8), 
        calcularMedia(blue9),  calcularMedia(blue10),  calcularMedia(blue11),  calcularMedia(blue12)]

      var varianciasB = [calcularVariancia(blue1), calcularVariancia(blue2), calcularVariancia(blue3), calcularVariancia(blue4), 
        calcularVariancia(blue5), calcularVariancia(blue6), calcularVariancia(blue7), calcularVariancia(blue8), 
        calcularVariancia(blue9), calcularVariancia(blue10), calcularVariancia(blue11), calcularVariancia(blue12)]
      var kuwaB = mediasB[calcularMinimoVariancia(varianciasB)]

      reds.push(kuwaR)
      greens.push(kuwaG)
      blues.push(kuwaB)

    }
  }

  let j = 0
  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = reds[j]
    newImgData.data[i + 1] = greens[j]
    newImgData.data[i + 2] = blues[j]
    newImgData.data[i + 3] = 255
    j++
  }

  console.log(newImgData.data)

  sbimg = imgDataToImg(newImgData, srcImage.width - 2, srcImage.height - 2)
  somboon.width = sbimg.width
  somboon.height = sbimg.height
  sb.drawImage(sbimg, 0, 0, sbimg.width, sbimg.height)

}

function calcularMediana(valores) {

  valores.sort(function (a, b) {
    return a - b;
  });

  const tamanho = valores.length;
  const metade = Math.floor(tamanho / 2);

  if (tamanho % 2 === 0) {
    const valorCentral1 = valores[metade - 1];
    const valorCentral2 = valores[metade];
    return (valorCentral1 + valorCentral2) / 2;
  } else {
    return valores[metade];
  }
}

function calcularMaximo(valores) {
  let max = valores[0]
  for (let i = 1; i<valores.length; i++) {
    if (valores[i] > max) {
      max = valores[i]
    }
  }
  return max
}

function calcularMinimo(valores) {
  let min = valores[0]
  for (let i = 1; i<valores.length; i++) {
    if (valores[i] < min) {
      min = valores[i]
    }
  }
  return min
}

function calcularMinimoVariancia(valores) {
  let min = valores[0]
  let pos = 0
  for (let i = 1; i<valores.length; i++) {
    if (valores[i] < min) {
      min = valores[i]
      pos = i
    }
  }
  return pos
}

function calcularModa(valores) {

  let mapFrequencia = {}
  valores.forEach(value => {
    if (mapFrequencia[value]) {
      mapFrequencia[value]++
    } else {
      mapFrequencia[value] = 1
    }
  })

  let moda = 0
  let maxFrequence = 0
  
  for (let value in mapFrequencia) {
    if (mapFrequencia[value] > maxFrequence) {
      moda = value
      maxFrequence = mapFrequencia[value]
    }
  }

  return moda
}

function calcularVariancia(valores) {
  let somatorio = 0
  let media = calcularMedia(valores)
  for (let i = 0; i < valores.length; i++){
    somatorio += Math.pow(valores[i] - media, 2)
  }
  return somatorio / valores.length
}

function calcularMedia(valores) {
  let soma = 0
  for (let i = 0; i < valores.length; i++){
    soma += valores[i]
  }
  return soma / 9
}

function getPixelIndex(x, y) {
  return (y * imgData.width + x) * 4
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