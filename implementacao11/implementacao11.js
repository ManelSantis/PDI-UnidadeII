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

//DETECTÇÃO DE PONTO
const ponto = document.getElementById('ponto')
const pontoc = document.getElementById('pontoc')
const pc = pontoc.getContext('2d')
let pcimg = new Image

ponto.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  var aux = parseInt(tvalue.value)

  let mascara = [-1, -1, -1,
  -1, 8, -1,
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

      if (aR < aux) { aR = 0 }
      if (aG < aux) { aG = 0 }
      if (aB < aux) { aB = 0 }

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

  pcimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  pontoc.width = pcimg.width
  pontoc.height = pcimg.height
  pc.drawImage(pcimg, 0, 0, pcimg.width, pcimg.height)
}

//RETA HORIZONTAL
const ho = document.getElementById('ho')
const hoc = document.getElementById('hoc')
const hc = hoc.getContext('2d')
let hcimg = new Image

ho.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [-1, -1, -1,
    2, 2, 2,
  -1, -1, -1]

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

  hcimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  hoc.width = hcimg.width
  hoc.height = hcimg.height
  hc.drawImage(hcimg, 0, 0, hcimg.width, hcimg.height)
}

//RETA VERTICAL
const ve = document.getElementById('ve')
const vec = document.getElementById('vec')
const vc = vec.getContext('2d')
let vcimg = new Image

ve.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [-1, 2, -1,
  -1, 2, -1,
  -1, 2, -1]

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

  vcimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  vec.width = vcimg.width
  vec.height = vcimg.height
  vc.drawImage(vcimg, 0, 0, vcimg.width, vcimg.height)
}

//RETA 45°
const qu = document.getElementById('qu')
const quc = document.getElementById('quc')
const qc = quc.getContext('2d')
let qcimg = new Image

qu.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [-1, -1, 2,
  -1, 2, -1,
    2, -1, -1]

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

  qcimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  quc.width = qcimg.width
  quc.height = qcimg.height
  qc.drawImage(qcimg, 0, 0, qcimg.width, qcimg.height)
}

//RETA 135°
const ce = document.getElementById('ce')
const cec = document.getElementById('cec')
const cc = cec.getContext('2d')
let ccimg = new Image

ce.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascara = [2, -1, -1,
    -1, 2, -1,
    -1, -1, 2]

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

  ccimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  cec.width = ccimg.width
  cec.height = ccimg.height
  cc.drawImage(ccimg, 0, 0, ccimg.width, ccimg.height)
}

//ROBERTS
const ro = document.getElementById('ro')
const roc = document.getElementById('roc')
const rca = roc.getContext('2d')
let rcaimg = new Image

ro.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascaraX = [1, 0,
    -1, 0]
  let mascaraY = [1, -1,
    0, 0]

  for (let y = 1; y <= srcImage.height - 1; y++) {
    for (let x = 1; x <= srcImage.width - 1; x++) {
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v1 = getPixelIndex(x + 1, y)
      var v2 = getPixelIndex(x, y + 1)
      var v3 = getPixelIndex(x + 1, y + 1)

      var valoresR = [imgData.data[v1], imgData.data[v2], imgData.data[v3], imgData.data[pixel]]
      var valoresG = [imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1], imgData.data[pixel + 1]]
      var valoresB = [imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2], imgData.data[pixel + 2]]

      var gRX = aplicarMascara(mascaraX, valoresR)
      var gRY = aplicarMascara(mascaraY, valoresR)
      var tR = Math.abs(gRX + gRY)

      var gGX = aplicarMascara(mascaraX, valoresG)
      var gGY = aplicarMascara(mascaraY, valoresG)
      var tG = Math.abs(gGX + gGY)

      var gBX = aplicarMascara(mascaraX, valoresB)
      var gBY = aplicarMascara(mascaraY, valoresB)
      var tB = Math.abs(gBX + gBY)

      reds.push(tR)
      greens.push(tG)
      blues.push(tB)
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

  rcaimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  roc.width = rcaimg.width
  roc.height = rcaimg.height
  rca.drawImage(rcaimg, 0, 0, rcaimg.width, rcaimg.height)
}

//ROBERTS CRUZADO
const rc = document.getElementById('rc')
const rcc = document.getElementById('rcc')
const rcr = rcc.getContext('2d')
let rcimg = new Image

rc.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascaraX = [1, 0,
    0, -1]
  let mascaraY = [0, 1,
    -1, 0]

  for (let y = 1; y <= srcImage.height - 1; y++) {
    for (let x = 1; x <= srcImage.width - 1; x++) {
      var pixel = getPixelIndex(x, y) //Pixel atual
      var v1 = getPixelIndex(x + 1, y)
      var v2 = getPixelIndex(x, y + 1)
      var v3 = getPixelIndex(x + 1, y + 1)

      var valoresR = [imgData.data[v1], imgData.data[v2], imgData.data[v3], imgData.data[pixel]]
      var valoresG = [imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1], imgData.data[pixel + 1]]
      var valoresB = [imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2], imgData.data[pixel + 2]]

      var gRX = aplicarMascara(mascaraX, valoresR)
      var gRY = aplicarMascara(mascaraY, valoresR)
      var tR = Math.abs(gRX + gRY)

      var gGX = aplicarMascara(mascaraX, valoresG)
      var gGY = aplicarMascara(mascaraY, valoresG)
      var tG = Math.abs(gGX + gGY)

      var gBX = aplicarMascara(mascaraX, valoresB)
      var gBY = aplicarMascara(mascaraY, valoresB)
      var tB = Math.abs(gBX + gBY)

      reds.push(tR)
      greens.push(tG)
      blues.push(tB)
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

  rcimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  rcc.width = rcimg.width
  rcc.height = rcimg.height
  rcr.drawImage(rcimg, 0, 0, rcimg.width, rcimg.height)
}

//PREWITT
const prewitt = document.getElementById('prewitt')
const tiposPrewitt = new Array(3)
tiposPrewitt[0] = document.getElementById('prx')
tiposPrewitt[1] = document.getElementById('pry')
tiposPrewitt[2] = document.getElementById('prm')

const tiposPrewittContext = new Array(3)
tiposPrewittContext[0] = tiposPrewitt[0].getContext('2d')
tiposPrewittContext[1] = tiposPrewitt[1].getContext('2d')
tiposPrewittContext[2] = tiposPrewitt[2].getContext('2d')

let tiposPrewittImg = new Array(3).fill(new Image)

prewitt.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = [[], [], []]
  let greens = [[], [], []]
  let blues = [[], [], []]

  let mascaraX = [-1, 0, 1,
  -1, 0, 1,
  -1, 0, 1]
  let mascaraY = [-1, -1, -1,
    0, 0, 0,
    1, 1, 1]

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

      //RED
      var valuesR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]

      var gXR = Math.abs(aplicarMascara(mascaraX, valuesR))
      var gYR = Math.abs(aplicarMascara(mascaraY, valuesR))
      var magR = gXR + gYR

      //GREEN
      var valuesG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]

      var gXG = Math.abs(aplicarMascara(mascaraX, valuesG))
      var gYG = Math.abs(aplicarMascara(mascaraY, valuesG))
      var magG = gXG + gYG

      //BLUE
      var valuesB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var gXB = Math.abs(aplicarMascara(mascaraX, valuesB))
      var gYB = Math.abs(aplicarMascara(mascaraY, valuesB))
      var magB = gXB + gYB

      //Matriz GX
      reds[0].push(gXR)
      greens[0].push(gXG)
      blues[0].push(gXB)

      //Matriz GY
      reds[1].push(gYR)
      greens[1].push(gYG)
      blues[1].push(gYB)

      //Matriz Magnitude
      reds[2].push(magR)
      greens[2].push(magG)
      blues[2].push(magB)
    }
  }

  let k = 0

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < newImgData.data.length; i += 4) {
      newImgData.data[i] = reds[j][k]
      newImgData.data[i + 1] = greens[j][k]
      newImgData.data[i + 2] = blues[j][k]
      newImgData.data[i + 3] = 255
      k++
    }
    k = 0
    tiposPrewittImg[j] = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
    tiposPrewitt[j].width = tiposPrewittImg[j].width
    tiposPrewitt[j].height = tiposPrewittImg[j].height
    tiposPrewittContext[j].drawImage(tiposPrewittImg[j], 0, 0, tiposPrewittImg[j].width, tiposPrewittImg[j].height)
  }
}

//SOBEL
const sobel = document.getElementById('sobel')
const tiposSobel = new Array(3)
tiposSobel[0] = document.getElementById('sox')
tiposSobel[1] = document.getElementById('soy')
tiposSobel[2] = document.getElementById('som')

const tiposSobelContext = new Array(3)
tiposSobelContext[0] = tiposSobel[0].getContext('2d')
tiposSobelContext[1] = tiposSobel[1].getContext('2d')
tiposSobelContext[2] = tiposSobel[2].getContext('2d')

let tiposSobelImg = new Array(3).fill(new Image)

sobel.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = [[], [], []]
  let greens = [[], [], []]
  let blues = [[], [], []]

  let mascaraX = [-1, 0, 1,
  -2, 0, 2,
  -1, 0, 1]
  let mascaraY = [-1, -2, -1,
    0, 0, 0,
    1, 2, 1]

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

      //RED
      var valuesR = [imgData.data[v0], imgData.data[v1], imgData.data[v2], imgData.data[v3],
      imgData.data[pixel], imgData.data[v5], imgData.data[v6], imgData.data[v7], imgData.data[v8]]

      var gXR = Math.abs(aplicarMascara(mascaraX, valuesR))
      var gYR = Math.abs(aplicarMascara(mascaraY, valuesR))
      var magR = gXR + gYR

      //GREEN
      var valuesG = [imgData.data[v0 + 1], imgData.data[v1 + 1], imgData.data[v2 + 1], imgData.data[v3 + 1],
      imgData.data[pixel + 1], imgData.data[v5 + 1], imgData.data[v6 + 1], imgData.data[v7 + 1], imgData.data[v8 + 1]]

      var gXG = Math.abs(aplicarMascara(mascaraX, valuesG))
      var gYG = Math.abs(aplicarMascara(mascaraY, valuesG))
      var magG = gXG + gYG

      //BLUE
      var valuesB = [imgData.data[v0 + 2], imgData.data[v1 + 2], imgData.data[v2 + 2], imgData.data[v3 + 2],
      imgData.data[pixel + 2], imgData.data[v5 + 2], imgData.data[v6 + 2], imgData.data[v7 + 2], imgData.data[v8 + 2]]

      var gXB = Math.abs(aplicarMascara(mascaraX, valuesB))
      var gYB = Math.abs(aplicarMascara(mascaraY, valuesB))
      var magB = gXB + gYB

      //Matriz GX
      reds[0].push(gXR)
      greens[0].push(gXG)
      blues[0].push(gXB)

      //Matriz GY
      reds[1].push(gYR)
      greens[1].push(gYG)
      blues[1].push(gYB)

      //Matriz Magnitude
      reds[2].push(magR)
      greens[2].push(magG)
      blues[2].push(magB)
    }
  }

  let k = 0

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < newImgData.data.length; i += 4) {
      newImgData.data[i] = reds[j][k]
      newImgData.data[i + 1] = greens[j][k]
      newImgData.data[i + 2] = blues[j][k]
      newImgData.data[i + 3] = 255
      k++
    }
    k = 0
    tiposSobelImg[j] = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
    tiposSobel[j].width = tiposSobelImg[j].width
    tiposSobel[j].height = tiposSobelImg[j].height
    tiposSobelContext[j].drawImage(tiposSobelImg[j], 0, 0, tiposSobelImg[j].width, tiposSobelImg[j].height)
  }
}

//KIRSH
const kirsh = document.getElementById('kirsh')
const ki = document.getElementById('ki')
const kc = ki.getContext('2d')
let kcimg = new Image

kirsh.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascaras = [
    [5, -3, -3,
      5, 0, -3,
      5, -3, -3],
    [-3, -3, -3,
      5, 0, -3,
      5, 5, -3],
    [-3, -3, -3,
    -3, 0, -3,
      5, 5, 5],
    [-3, -3, -3,
    -3, 0, 5,
    -3, 5, 5],
    [-3, -3, 5,
    -3, 0, 5,
    -3, -3, 5],
    [-3, 5, 5,
    -3, 0, 5,
    -3, -3, -3],
    [5, 5, 5,
      -3, 0, -3,
      -3, -3, -3],
    [5, 5, -3,
      5, 0, -3,
      -3, -3, -3],
  ]

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

      var valuesR = [
        aplicarMascara(mascaras[0], valoresR),
        aplicarMascara(mascaras[1], valoresR),
        aplicarMascara(mascaras[2], valoresR),
        aplicarMascara(mascaras[3], valoresR),
        aplicarMascara(mascaras[4], valoresR),
        aplicarMascara(mascaras[5], valoresR),
        aplicarMascara(mascaras[6], valoresR),
        aplicarMascara(mascaras[7], valoresR)
      ]

      var valuesG = [
        aplicarMascara(mascaras[0], valoresG),
        aplicarMascara(mascaras[1], valoresG),
        aplicarMascara(mascaras[2], valoresG),
        aplicarMascara(mascaras[3], valoresG),
        aplicarMascara(mascaras[4], valoresG),
        aplicarMascara(mascaras[5], valoresG),
        aplicarMascara(mascaras[6], valoresG),
        aplicarMascara(mascaras[7], valoresG)
      ]

      var valuesB = [
        aplicarMascara(mascaras[0], valoresB),
        aplicarMascara(mascaras[1], valoresB),
        aplicarMascara(mascaras[2], valoresB),
        aplicarMascara(mascaras[3], valoresB),
        aplicarMascara(mascaras[4], valoresB),
        aplicarMascara(mascaras[5], valoresB),
        aplicarMascara(mascaras[6], valoresB),
        aplicarMascara(mascaras[7], valoresB)
      ]

      reds.push(calcularMaximo(valuesR))
      greens.push(calcularMaximo(valuesG))
      blues.push(calcularMaximo(valuesB))
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

  kcimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  ki.width = kcimg.width
  ki.height = kcimg.height
  kc.drawImage(kcimg, 0, 0, kcimg.width, kcimg.height)
}

//ROBSON
const robson = document.getElementById('robson')
const rob = document.getElementById('rob')
const robc = rob.getContext('2d')
let robimg = new Image

robson.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = []
  let greens = []
  let blues = []

  let mascaras = [
    [1, 0, -1,
      2, 0, -2,
      1, 0, -1],
    [0, -1, -2,
      1, 0, -1,
      2, 1, 0],
    [-1, -2, -1,
      0, 0, 0,
      1, 2, 1],
    [-2, -1, 0,
    -1, 0, 1,
      0, 1, 2],
    [-1, 0, 1,
    -2, 0, 2,
    -1, 0, 1],
    [0, 1, 2,
      -1, 0, 1,
      -2, -1, 0],
    [1, 2, 1,
      0, 0, 0,
      -1, -2, -1],
    [2, 1, 0,
      1, 0, -1,
      0, -1, -2]

  ]

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

      var valuesR = [
        aplicarMascara(mascaras[0], valoresR),
        aplicarMascara(mascaras[1], valoresR),
        aplicarMascara(mascaras[2], valoresR),
        aplicarMascara(mascaras[3], valoresR),
        aplicarMascara(mascaras[4], valoresR),
        aplicarMascara(mascaras[5], valoresR),
        aplicarMascara(mascaras[6], valoresR),
        aplicarMascara(mascaras[7], valoresR)
      ]

      var valuesG = [
        aplicarMascara(mascaras[0], valoresG),
        aplicarMascara(mascaras[1], valoresG),
        aplicarMascara(mascaras[2], valoresG),
        aplicarMascara(mascaras[3], valoresG),
        aplicarMascara(mascaras[4], valoresG),
        aplicarMascara(mascaras[5], valoresG),
        aplicarMascara(mascaras[6], valoresG),
        aplicarMascara(mascaras[7], valoresG)
      ]

      var valuesB = [
        aplicarMascara(mascaras[0], valoresB),
        aplicarMascara(mascaras[1], valoresB),
        aplicarMascara(mascaras[2], valoresB),
        aplicarMascara(mascaras[3], valoresB),
        aplicarMascara(mascaras[4], valoresB),
        aplicarMascara(mascaras[5], valoresB),
        aplicarMascara(mascaras[6], valoresB),
        aplicarMascara(mascaras[7], valoresB)
      ]

      reds.push(calcularMaximo(valuesR))
      greens.push(calcularMaximo(valuesG))
      blues.push(calcularMaximo(valuesB))
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

  robimg = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
  rob.width = robimg.width
  rob.height = robimg.height
  robc.drawImage(robimg, 0, 0, robimg.width, robimg.height)
}

//FREI-CHEN
const frei = document.getElementById('frei')

const tiposFrei = new Array(9)
tiposFrei[0] = document.getElementById('frei1')
tiposFrei[1] = document.getElementById('frei2')
tiposFrei[2] = document.getElementById('frei3')
tiposFrei[3] = document.getElementById('frei4')
tiposFrei[4] = document.getElementById('frei5')
tiposFrei[5] = document.getElementById('frei6')
tiposFrei[6] = document.getElementById('frei7')
tiposFrei[7] = document.getElementById('frei8')
tiposFrei[8] = document.getElementById('frei9')

const tiposFreiContext = new Array(9)
tiposFreiContext[0] = tiposFrei[0].getContext('2d')
tiposFreiContext[1] = tiposFrei[1].getContext('2d')
tiposFreiContext[2] = tiposFrei[2].getContext('2d')
tiposFreiContext[3] = tiposFrei[3].getContext('2d')
tiposFreiContext[4] = tiposFrei[4].getContext('2d')
tiposFreiContext[5] = tiposFrei[5].getContext('2d')
tiposFreiContext[6] = tiposFrei[6].getContext('2d')
tiposFreiContext[7] = tiposFrei[7].getContext('2d')
tiposFreiContext[8] = tiposFrei[8].getContext('2d')

const imgFrei = new Array(9).fill(new Image)

frei.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = [[], [], [], [], [], [], [], [], []]
  let greens = [[], [], [], [], [], [], [], [], []]
  let blues = [[], [], [], [], [], [], [], [], []]

  let mascaraW = [
    1, 1, 1,
    1, 1, 1,
    1, 1, 1
  ]

  let mascaras = [
    [1, Math.sqrt(2), 1,
      0, 0, 0,
      -1, Math.sqrt(2) * -1, -1],
    [1, 0, -1,
      Math.sqrt(2), 0, Math.sqrt(2) * -1,
      1, 0, -1],
    [0, -1, Math.sqrt(2),
      1, 0, -1,
      Math.sqrt(2) * -1, 1, 0],
    [Math.sqrt(2), -1, 0,
    -1, 0, 1,
      0, 1, Math.sqrt(2) * -1],
    [0, 1, 0,
      -1, 0, -1,
      0, 1, 0],
    [-1, 0, 1,
      0, 0, 0,
      1, 0, -1],
    [1, -2, 1,
      -2, 4, -2,
      1, -2, 1],
    [-2, 1, -2,
      1, 4, 1,
    -2, 1, -2],
    [1, 1, 1,
      1, 1, 1,
      1, 1, 1],
  ]

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

      var valuesR = [
        aplicarMascara(mascaras[0], valoresR),
        aplicarMascara(mascaras[1], valoresR),
        aplicarMascara(mascaras[2], valoresR),
        aplicarMascara(mascaras[3], valoresR),
        aplicarMascara(mascaras[4], valoresR),
        aplicarMascara(mascaras[5], valoresR),
        aplicarMascara(mascaras[6], valoresR),
        aplicarMascara(mascaras[7], valoresR),
        aplicarMascara(mascaras[8], valoresR)
      ]

      var valuesG = [
        aplicarMascara(mascaras[0], valoresG),
        aplicarMascara(mascaras[1], valoresG),
        aplicarMascara(mascaras[2], valoresG),
        aplicarMascara(mascaras[3], valoresG),
        aplicarMascara(mascaras[4], valoresG),
        aplicarMascara(mascaras[5], valoresG),
        aplicarMascara(mascaras[6], valoresG),
        aplicarMascara(mascaras[7], valoresG),
        aplicarMascara(mascaras[8], valoresG)

      ]

      var valuesB = [
        aplicarMascara(mascaras[0], valoresB),
        aplicarMascara(mascaras[1], valoresB),
        aplicarMascara(mascaras[2], valoresB),
        aplicarMascara(mascaras[3], valoresB),
        aplicarMascara(mascaras[4], valoresB),
        aplicarMascara(mascaras[5], valoresB),
        aplicarMascara(mascaras[6], valoresB),
        aplicarMascara(mascaras[7], valoresB),
        aplicarMascara(mascaras[8], valoresB)
      ]

      for (let i = 0; i < 9; i++) {
        reds[i].push(valuesR[i])
        greens[i].push(valuesG[i])
        blues[i].push(valuesB[i])
      }
    }
  }


  let k = 0
  for (let j = 0; j < 9; j++) {
    for (let i = 0; i < newImgData.data.length; i += 4) {
      newImgData.data[i] = reds[j][k]
      newImgData.data[i + 1] = greens[j][k]
      newImgData.data[i + 2] = blues[j][k]
      newImgData.data[i + 3] = 255
      k++
    }
    k = 0
    imgFrei[j] = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
    tiposFrei[j].width = imgFrei[j].width
    tiposFrei[j].height = imgFrei[j].height
    tiposFreiContext[j].drawImage(imgFrei[j], 0, 0, imgFrei[j].width, imgFrei[j].height)
  }
}

//LAPLICIANO
const laplaciano = document.getElementById('laplaciano')

const tiposLap = new Array(2)
tiposLap[0] = document.getElementById('lap1')
tiposLap[1] = document.getElementById('lap2')

const tiposLapContext = new Array(2)
tiposLapContext[0] = tiposLap[0].getContext('2d')
tiposLapContext[1] = tiposLap[1].getContext('2d')

const imgLap = new Array(2).fill(new Image)

laplaciano.onclick = function () {

  let newImgData = new ImageData(srcImage.width - 1, srcImage.height - 1)
  let reds = [[], []]
  let greens = [[], []]
  let blues = [[], []]

  let mascaras = [
    [0, -1, 0,
      -1, 4, -1,
      0, -1, 0],
    [-1, -4, -1,
    -4, 20, -4,
    -1, -4, -1]
  ]

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

      var valuesR = [
        aplicarMascara(mascaras[0], valoresR),
        aplicarMascara(mascaras[1], valoresR)
      ]

      var valuesG = [
        aplicarMascara(mascaras[0], valoresG),
        aplicarMascara(mascaras[1], valoresG)
      ]

      var valuesB = [
        aplicarMascara(mascaras[0], valoresB),
        aplicarMascara(mascaras[1], valoresB)
      ]

      for (let i = 0; i < 2; i++) {
        reds[i].push(valuesR[i])
        greens[i].push(valuesG[i])
        blues[i].push(valuesB[i])
      }
    }
  }


  let k = 0
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < newImgData.data.length; i += 4) {
      newImgData.data[i] = reds[j][k]
      newImgData.data[i + 1] = greens[j][k]
      newImgData.data[i + 2] = blues[j][k]
      newImgData.data[i + 3] = 255
      k++
    }
    k = 0
    imgLap[j] = imgDataToImg(newImgData, srcImage.width - 1, srcImage.height - 1)
    tiposLap[j].width = imgLap[j].width
    tiposLap[j].height = imgLap[j].height
    tiposLapContext[j].drawImage(imgLap[j], 0, 0, imgLap[j].width, imgLap[j].height)
  }
}

const t = document.getElementById('t')
const tvalue = document.getElementById('tvalue')

tvalue.oninput = function (e) {
  t.innerHTML = tvalue.value;
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