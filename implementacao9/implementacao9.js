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

//H1
const h1 = document.getElementById('h1')
const hh1 = document.getElementById('hh1')
const h = hh1.getContext('2d')
let himg = new Image

h1.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [0, -1, 0,
    -1, 4, -1,
    0, -1, 0]

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

      var valoresR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var valoresG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var valoresB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var h1R = aplicarMascara(mascara, valoresR)
      var h1G = aplicarMascara(mascara, valoresG)
      var h1B = aplicarMascara(mascara, valoresB)

      reds.push(h1R)
      greens.push(h1G)
      blues.push(h1B)
      count++
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

  himg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  hh1.width = himg.width
  hh1.height = himg.height
  h.drawImage(himg, 0, 0, himg.width, himg.height)

}

//H2
const h2 = document.getElementById('h2')
const hh2 = document.getElementById('hh2')
const hh = hh2.getContext('2d')
let hhimg = new Image

h2.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [-1, -1, -1,
    -1, 8, -1,
    -1, -1, -1]

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

      var valoresR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var valoresG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var valoresB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var h2R = aplicarMascara(mascara, valoresR)
      var h2G = aplicarMascara(mascara, valoresG)
      var h2B = aplicarMascara(mascara, valoresB)

      reds.push(h2R)
      greens.push(h2G)
      blues.push(h2B)
      count++
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

  hhimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  hh2.width = hhimg.width
  hh2.height = hhimg.height
  hh.drawImage(hhimg, 0, 0, hhimg.width, hhimg.height)
}

//M1
const m1 = document.getElementById('m1')
const mm1 = document.getElementById('mm1')
const m = mm1.getContext('2d')
let mimg = new Image

m1.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [-1, -1, -1,
    -1, 9, -1,
    -1, -1, -1]

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

      var valoresR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var valoresG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var valoresB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var m1R = aplicarMascara(mascara, valoresR)
      var m1G = aplicarMascara(mascara, valoresG)
      var m1B = aplicarMascara(mascara, valoresB)

      reds.push(m1R)
      greens.push(m1G)
      blues.push(m1B)
      count++
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

  mimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  mm1.width = mimg.width
  mm1.height = mimg.height
  m.drawImage(mimg, 0, 0, mimg.width, mimg.height)
}

//M2
const m2 = document.getElementById('m2')
const mm2 = document.getElementById('mm2')
const mm = mm2.getContext('2d')
let mmimg = new Image

m2.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [1, -2, 1,
    -2, 5, -2,
    1, -2, 1]

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

      var valoresR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var valoresG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var valoresB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var m2R = aplicarMascara(mascara, valoresR)
      var m2G = aplicarMascara(mascara, valoresG)
      var m2B = aplicarMascara(mascara, valoresB)

      reds.push(m2R)
      greens.push(m2G)
      blues.push(m2B)
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

  mmimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  mm2.width = mmimg.width
  mm2.height = mmimg.height
  mm.drawImage(mmimg, 0, 0, mmimg.width, mmimg.height)
}

//M3
const m3 = document.getElementById('m3')
const mm3 = document.getElementById('mm3')
const mmm = mm3.getContext('2d')
let mmmimg = new Image

m3.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [0, -1, 0,
    -1, 5, -1,
    0, -1, 0]

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

      var valoresR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var valoresG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var valoresB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var m3R = aplicarMascara(mascara, valoresR)
      var m3G = aplicarMascara(mascara, valoresG)
      var m3B = aplicarMascara(mascara, valoresB)

      reds.push(m3R)
      greens.push(m3G)
      blues.push(m3B)
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

  mmmimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  mm3.width = mmmimg.width
  mm3.height = mmmimg.height
  mmm.drawImage(mmmimg, 0, 0, mmmimg.width, mmmimg.height)
}

//ALTO REFORÇO
const reforco = document.getElementById('reforco')
const alto = document.getElementById('alto')
const ra = alto.getContext('2d')
let raimg = new Image

const a = document.getElementById('a')
const avalue = document.getElementById('avalue')

reforco.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  var aux = parseFloat(avalue.value)

  let mascara = [-1, -1, -1,
    -1, (9*aux)-1, -1,
    -1, -1, -1]

  console.log(mascara)

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

      var valoresR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]
      var valoresG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]
      var valoresB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var aR = aplicarMascara(mascara, valoresR)
      var aG = aplicarMascara(mascara, valoresG)
      var aB = aplicarMascara(mascara, valoresB)

      reds.push(aR)
      greens.push(aG)
      blues.push(aB)
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

  raimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  alto.width = raimg.width
  alto.height = raimg.height
  ra.drawImage(raimg, 0, 0, raimg.width, raimg.height)
}

avalue.oninput = function (e) {
  a.innerHTML = avalue.value;
}

function aplicarMascara(mascara, valores) {
  let soma = 0
  for (let i = 0; i < mascara.length; i++) {
    soma += (mascara[i] * valores[i])
  }
  return soma
}

function calcularMedia(valores) {
  let soma = 0
  for (let i = 0; i < valores.length; i++) {
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