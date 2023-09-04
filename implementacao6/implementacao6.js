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

//Equalização

const equalizar = document.getElementById('equalizar')
const equal = document.getElementById('equal')
const eq = equal.getContext('2d')
let eqImg = new Image

const histoCanvas = document.getElementById('histoCanvas').getContext('2d')
const histoEqual = document.getElementById('histoEqual').getContext('2d')

equalizar.onclick = function () {

  let labelsHisto = []
  for (let i = 0; i < 256; i++) {
    labelsHisto.push(i)
  }
  //Calcular a quantidade de vezes que a intensidade de cinza vai aparecer
  let numPixels = imgData.data.length / 4
  var histogramInit = new Array(256).fill(0)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let valor = imgData.data[i]
    histogramInit[valor]++
  }

  //Calcular as probabilidades
  let probabilidadeHistogram = new Array(256).fill(0)
  for (let i = 0; i < numPixels; i++) {
    probabilidadeHistogram[i] = histogramInit[i] / numPixels
  }

  //Distribuição
  let distribuicao = new Array(256).fill(0);
  distribuicao[0] = probabilidadeHistogram[0];
  for (let i = 1; i < 256; i++) {
    distribuicao[i] = distribuicao[i - 1] + probabilidadeHistogram[i];
  }

  // Equalizar os valores dos pixels
  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    const valor = imgData.data[i]
    const equalizado = distribuicao[valor] * 255
    newImgData.data[i] = newImgData.data[i + 1] = newImgData.data[i + 2] = equalizado
    newImgData.data[i + 3] = 255
  }

  var histogramNew = new Array(256).fill(0)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let valor = newImgData.data[i]
    histogramNew[valor]++
  }

  eqImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  equal.width = eqImg.width
  equal.height = eqImg.height
  eq.drawImage(eqImg, 0, 0, eqImg.width, eqImg.height)

  var histogramInitData = {
    labels: labelsHisto,
    datasets: [{
      label: 'Histograma Inicial',
      data: histogramInit,
      backgroundColor: 'rgba(0, 0, 0, 1)',
      borderWidth: 1
    }]
  };

  var histogramNewData = {
    labels: labelsHisto,
    datasets: [{
      label: 'Histograma Equalizado',
      data: histogramNew,
      backgroundColor: 'rgba(0, 0, 0, 1)',
      borderWidth: 1
    }]
  };

  var chartInitConfig = {
    type: 'bar', // Tipo de gráfico
    data: histogramInitData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  var chartNewConfig = {
    type: 'bar', // Tipo de gráfico
    data: histogramNewData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  new Chart(histoCanvas, chartInitConfig)
  new Chart(histoEqual, chartNewConfig)
}

//Gama
const gam = document.getElementById('gam')
const gamaCanvas = document.getElementById('gamaCanvas')
const gc = gamaCanvas.getContext('2d')
let gcImg = new Image

const gama = document.getElementById('gama')
const valueGama= document.getElementById('valueGama')

gam.onclick = function () {
  let gamaValue = parseFloat(gama.value)

  let newImgData = new ImageData(srcImage.width, srcImage.height)
  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = Math.pow(imgData.data[i] / 255, gamaValue) * 255
    newImgData.data[i + 1] = Math.pow(imgData.data[i + 1] / 255, gamaValue) * 255
    newImgData.data[i + 2] = Math.pow(imgData.data[i + 2] / 255, gamaValue) * 255
    newImgData.data[i + 3] = 255
  }

  gcImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  gamaCanvas.width = gcImg.width
  gamaCanvas.height = gcImg.height
  gc.drawImage(gcImg, 0, 0, gcImg.width, gcImg.height)

}

gama.oninput = function (e) {
  valueGama.innerHTML = gama.value;
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