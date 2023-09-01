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

//LIMIARIZAÇÃO GLOBAL
const lg = document.getElementById('lg')
const lgc = document.getElementById('lgc')
const lc = lgc.getContext('2d')
let lcimg = new Image

lg.onclick = function () {
  let newImgData = new ImageData(srcImage.width, srcImage.height)
  var aux = parseInt(tvalue.value)

  for (let i = 0; i < newImgData.data.length; i += 4) {
    newImgData.data[i] = (imgData.data[i] <= aux ? 0 : 255)
    newImgData.data[i + 1] = (imgData.data[i + 1] <= aux ? 0 : 255)
    newImgData.data[i + 2] = (imgData.data[i + 2] <= aux ? 0 : 255)
    newImgData.data[i + 3] = 255
  }

  lcimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  lgc.width = lcimg.width
  lgc.height = lcimg.height
  lc.drawImage(lcimg, 0, 0, lcimg.width, lcimg.height)
}

//LIMIARIZAÇÃO LOCAL MEDIA
const lm = document.getElementById('lm')
const lmc = document.getElementById('lmc')
const lmm = lmc.getContext('2d')
let lmimg = new Image

lm.onclick = function () {
  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  let tamX = 10
  let tamY = 10

  let coeficientes = []

  for (let y = 0; y < tamY; y++) {
    for (let x = 0; x < tamX; x++) {
      coeficientes.push([x, y])
    }
  }

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      let pixel = getPixelIndex(x, y)

      let reds = []
      let greens = []
      let blues = []

      for (const [dx, dy] of coeficientes) {
        const newX = x + dx
        const newY = y + dy
        if (newX >= 0 && newX < srcImage.width && newY >= 0 && newY < srcImage.height) {
          let value = getPixelIndex(newX, newY)
          reds.push(newImgData.data[value])
          greens.push(newImgData.data[value + 1])
          blues.push(newImgData.data[value + 2])
        }
      }

      let limiarR = calcularMediana(reds, (tamX * tamY))
      let limiarG = calcularMediana(greens, (tamX * tamY))
      let limiarB = calcularMediana(blues, (tamX * tamY))

      newImgData.data[pixel] = (newImgData.data[pixel] < limiarR ? 0 : 255)
      newImgData.data[pixel + 1] = (newImgData.data[pixel + 1] < limiarG ? 0 : 255)
      newImgData.data[pixel + 2] = (newImgData.data[pixel + 2] < limiarB ? 0 : 255)
      newImgData.data[pixel + 3] = 255

    }
  }

  lmimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  lmc.width = lmimg.width
  lmc.height = lmimg.height
  lmm.drawImage(lmimg, 0, 0, lmimg.width, lmimg.height)
}

//LIMIARIZAÇÃO LOCAL MEDIANA
const lme = document.getElementById('lme')
const lmec = document.getElementById('lmec')
const lmme = lmec.getContext('2d')
let lmeimg = new Image

lme.onclick = function () {
  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  let tamX = 10
  let tamY = 10

  let coeficientes = []

  for (let y = 0; y < tamY; y++) {
    for (let x = 0; x < tamX; x++) {
      coeficientes.push([x, y])
    }
  }

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      let pixel = getPixelIndex(x, y)

      let reds = []
      let greens = []
      let blues = []

      for (const [dx, dy] of coeficientes) {
        const newX = x + dx
        const newY = y + dy
        if (newX >= 0 && newX < srcImage.width && newY >= 0 && newY < srcImage.height) {
          let value = getPixelIndex(newX, newY)
          reds.push(newImgData.data[value])
          greens.push(newImgData.data[value + 1])
          blues.push(newImgData.data[value + 2])
        }
      }

      let limiarR = calcularMedia(reds, (tamX * tamY))
      let limiarG = calcularMedia(greens, (tamX * tamY))
      let limiarB = calcularMedia(blues, (tamX * tamY))

      newImgData.data[pixel] = (newImgData.data[pixel] < limiarR ? 0 : 255)
      newImgData.data[pixel + 1] = (newImgData.data[pixel + 1] < limiarG ? 0 : 255)
      newImgData.data[pixel + 2] = (newImgData.data[pixel + 2] < limiarB ? 0 : 255)
      newImgData.data[pixel + 3] = 255

    }
  }

  lmeimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  lmec.width = lmeimg.width
  lmec.height = lmeimg.height
  lmme.drawImage(lmeimg, 0, 0, lmeimg.width, lmeimg.height)
}

//LIMIARIZAÇÃO LOCAL MAXIMO/MINIMO
const maxmin = document.getElementById('maxmin')
const maxminc = document.getElementById('maxminc')
const maxm = maxminc.getContext('2d')
let maxmimg = new Image

maxmin.onclick = function () {
  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  let tamX = 10
  let tamY = 10

  let coeficientes = []

  for (let y = 0; y < tamY; y++) {
    for (let x = 0; x < tamX; x++) {
      coeficientes.push([x, y])
    }
  }

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      let pixel = getPixelIndex(x, y)

      let reds = []
      let greens = []
      let blues = []

      for (const [dx, dy] of coeficientes) {
        const newX = x + dx
        const newY = y + dy
        if (newX >= 0 && newX < srcImage.width && newY >= 0 && newY < srcImage.height) {
          let value = getPixelIndex(newX, newY)
          reds.push(newImgData.data[value])
          greens.push(newImgData.data[value + 1])
          blues.push(newImgData.data[value + 2])
        }
      }

      let limiarR = (calcularMaximo(reds) + calcularMinimo(reds)) / 2
      let limiarG = (calcularMaximo(greens) + calcularMinimo(greens)) / 2
      let limiarB = (calcularMaximo(blues) + calcularMinimo(blues)) / 2

      newImgData.data[pixel] = (newImgData.data[pixel] < limiarR ? 0 : 255)
      newImgData.data[pixel + 1] = (newImgData.data[pixel + 1] < limiarG ? 0 : 255)
      newImgData.data[pixel + 2] = (newImgData.data[pixel + 2] < limiarB ? 0 : 255)
      newImgData.data[pixel + 3] = 255

    }
  }

  maxmimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  maxminc.width = maxmimg.width
  maxminc.height = maxmimg.height
  maxm.drawImage(maxmimg, 0, 0, maxmimg.width, maxmimg.height)
}

//NIBLACK
const nb = document.getElementById('nb')
const nbc = document.getElementById('nbc')
const nnb = nbc.getContext('2d')
let nbmimg = new Image

nb.onclick = function () {
  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  let tamX = parseInt(nvalue.value)
  let tamY = parseInt(nvalue.value)

  let aux = parseInt(kvalue.value)

  let coeficientes = []

  for (let y = 0; y < tamY; y++) {
    for (let x = 0; x < tamX; x++) {
      coeficientes.push([x, y])
    }
  }

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      let pixel = getPixelIndex(x, y)

      let reds = []
      let greens = []
      let blues = []

      for (const [dx, dy] of coeficientes) {
        const newX = x + dx
        const newY = y + dy
        if (newX >= 0 && newX < srcImage.width && newY >= 0 && newY < srcImage.height) {
          let value = getPixelIndex(newX, newY)
          reds.push(newImgData.data[value])
          greens.push(newImgData.data[value + 1])
          blues.push(newImgData.data[value + 2])
        }
      }

      let limiarR = calcularMedia(reds, reds.length) + calcularDesvio(reds, reds.length) * aux
      let limiarG = calcularMedia(greens, greens.length) + calcularDesvio(greens, greens.length) * aux
      let limiarB = calcularMedia(blues, blues.length) + calcularDesvio(blues, blues.length) * aux

      newImgData.data[pixel] = (newImgData.data[pixel] < limiarR ? 0 : 255)
      newImgData.data[pixel + 1] = (newImgData.data[pixel + 1] < limiarG ? 0 : 255)
      newImgData.data[pixel + 2] = (newImgData.data[pixel + 2] < limiarB ? 0 : 255)
      newImgData.data[pixel + 3] = 255

    }
  }

  nbmimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  nbc.width = nbmimg.width
  nbc.height = nbmimg.height
  nnb.drawImage(nbmimg, 0, 0, nbmimg.width, nbmimg.height)
}

//SEGMENTAÇÃO REGIÃO
const sg = document.getElementById('sg')
const sgc = document.getElementById('sgc')
const ssg = sgc.getContext('2d')
let sgimg = new Image

sg.onclick = function () {
  let newImgData = new ImageData(srcImage.width, srcImage.height)

  let values = [155, 55, 100, 28, 200, 5]

  let colors = [
    [213, 38, 184],
    [36, 61, 213],
    [216, 7, 15],
    [35, 216, 7],
    [0, 212, 177],
    [249, 255, 31]
  ]

  for (let i = 0; i < imgData.data.length; i += 4) {
    let value = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3

    for (let j = 0; j < values.length; j++) {
      if (Math.abs(values[j] - value) == 0 || Math.abs(values[j] - value) <= 15) {
        newImgData.data[i] = colors[j][0]
        newImgData.data[i + 1] = colors[j][1]
        newImgData.data[i + 2] = colors[j][2]
        break;
      } else {
        newImgData.data[i] = imgData.data[i]
        newImgData.data[i + 1] = imgData.data[i + 1]
        newImgData.data[i + 2] = imgData.data[i + 2]
      }
    }
    newImgData.data[i + 3] = 255
  }

  sgimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  sgc.width = sgimg.width
  sgc.height = sgimg.height
  ssg.drawImage(sgimg, 0, 0, sgimg.width, sgimg.height)
}

const t = document.getElementById('t')
const tvalue = document.getElementById('tvalue')

tvalue.oninput = function (e) {
  t.innerHTML = tvalue.value;
}

const n = document.getElementById('n')
const nvalue = document.getElementById('nvalue')

nvalue.oninput = function (e) {
  n.innerHTML = nvalue.value;
}

const k = document.getElementById('k')
const kvalue = document.getElementById('kvalue')

kvalue.oninput = function (e) {
  k.innerHTML = kvalue.value;
}

function calcularDesvio(valores, tam) {
  let media = calcularMedia(valores, tam)
  var varianca = valores.reduce((total, valor) => total + Math.pow(media - valor, 2) / tam, 0)
  let desvioPadrao = Math.sqrt(varianca)
  return desvioPadrao
}

function calcularMedia(valores, tam) {
  let soma = 0
  for (let i = 0; i < valores.length; i++) {
    soma += valores[i]
  }
  return soma / tam
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
  for (let i = 1; i < valores.length; i++) {
    if (valores[i] > max) {
      max = valores[i]
    }
  }
  return max
}

function calcularMinimo(valores) {
  let min = valores[0]
  for (let i = 1; i < valores.length; i++) {
    if (valores[i] < min) {
      min = valores[i]
    }
  }
  return min
}

function calcularMaximo(valores) {
  let max = valores[0]
  for (let i = 1; i < valores.length; i++) {
    if (valores[i] > max) {
      max = valores[i]
    }
  }
  return max
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