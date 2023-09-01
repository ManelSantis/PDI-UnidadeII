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

//ORDENADO 2X2
const o2 = document.getElementById('o2')
const oo2 = document.getElementById('oo2')
const o = oo2.getContext('2d')
let oimg = new Image

o2.onclick = function () {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  let pointSizeX = 2
  let pointSizeY = 2

  let matriz = [128, 32, 110, 223]

  for (let y = 0; y < srcImage.height; y += pointSizeY) {
    for (let x = 0; x < srcImage.width; x += pointSizeX) {
      var v0 = getPixelIndex(x + 1, y + 1)
      var v1 = getPixelIndex(x, y + 1)
      var v3 = getPixelIndex(x + 1, y)
      var pixel = getPixelIndex(x, y) //Pixel atual

      let averageColor = (imgData.data[pixel] + imgData.data[pixel + 1] + imgData.data[pixel + 2]) / 3

      let value = averageColor < matriz[0] ? 0 : 255
      newImgData.data[pixel] = value
      newImgData.data[pixel + 1] = value
      newImgData.data[pixel + 2] = value
      newImgData.data[pixel + 3] = 255

      averageColor = (imgData.data[v0] + imgData.data[v0 + 1] + imgData.data[v0 + 2]) / 3

      value = averageColor < matriz[1] ? 0 : 255
      newImgData.data[v0] = value
      newImgData.data[v0 + 1] = value
      newImgData.data[v0 + 2] = value
      newImgData.data[v0 + 3] = 255

      averageColor = (imgData.data[v1] + imgData.data[v1 + 1] + imgData.data[v1 + 2]) / 3

      value = averageColor < matriz[2] ? 0 : 255
      newImgData.data[v1] = value
      newImgData.data[v1 + 1] = value
      newImgData.data[v1 + 2] = value
      newImgData.data[v1 + 3] = 255

      averageColor = (imgData.data[v3] + imgData.data[v3 + 1] + imgData.data[v3 + 2]) / 3

      value = averageColor < matriz[3] ? 0 : 255
      newImgData.data[v3] = value
      newImgData.data[v3 + 1] = value
      newImgData.data[v3 + 2] = value
      newImgData.data[v3 + 3] = 255
    }
  }

  oimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  oo2.width = oimg.width
  oo2.height = oimg.height
  o.drawImage(oimg, 0, 0, oimg.width, oimg.height)

}

//ORDENADO 2X3
const o23 = document.getElementById('o23')
const oo23 = document.getElementById('oo23')
const oo = oo23.getContext('2d')
let ooimg = new Image

o23.onclick = function () {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  let pointSizeX = 3
  let pointSizeY = 2

  let matriz = [128, 32, 110, 223, 250, 132]

  for (let y = 0; y < srcImage.height; y += pointSizeY) {
    for (let x = 0; x < srcImage.width; x += pointSizeX) {
      var v0 = getPixelIndex(x + 1, y)
      var v1 = getPixelIndex(x + 2, y)
      var v3 = getPixelIndex(x, y + 1)
      var v4 = getPixelIndex(x + 1, y + 1)
      var v5 = getPixelIndex(x + 2, y + 1)
      var pixel = getPixelIndex(x, y) //Pixel atual

      let averageColor = (imgData.data[pixel] + imgData.data[pixel + 1] + imgData.data[pixel + 2]) / 3

      let value = averageColor < matriz[0] ? 0 : 255
      newImgData.data[pixel] = value
      newImgData.data[pixel + 1] = value
      newImgData.data[pixel + 2] = value
      newImgData.data[pixel + 3] = 255

      averageColor = (imgData.data[v0] + imgData.data[v0 + 1] + imgData.data[v0 + 2]) / 3

      value = averageColor < matriz[1] ? 0 : 255
      newImgData.data[v0] = value
      newImgData.data[v0 + 1] = value
      newImgData.data[v0 + 2] = value
      newImgData.data[v0 + 3] = 255

      averageColor = (imgData.data[v1] + imgData.data[v1 + 1] + imgData.data[v1 + 2]) / 3

      value = averageColor < matriz[2] ? 0 : 255
      newImgData.data[v1] = value
      newImgData.data[v1 + 1] = value
      newImgData.data[v1 + 2] = value
      newImgData.data[v1 + 3] = 255

      averageColor = (imgData.data[v3] + imgData.data[v3 + 1] + imgData.data[v3 + 2]) / 3

      value = averageColor < matriz[3] ? 0 : 255
      newImgData.data[v3] = value
      newImgData.data[v3 + 1] = value
      newImgData.data[v3 + 2] = value
      newImgData.data[v3 + 3] = 255

      averageColor = (imgData.data[v3] + imgData.data[v3 + 1] + imgData.data[v3 + 2]) / 3

      value = averageColor < matriz[4] ? 0 : 255
      newImgData.data[v4] = value
      newImgData.data[v4 + 1] = value
      newImgData.data[v4 + 2] = value
      newImgData.data[v4 + 3] = 255

      averageColor = (imgData.data[v5] + imgData.data[v5 + 1] + imgData.data[v5 + 2]) / 3

      value = averageColor < matriz[5] ? 0 : 255
      newImgData.data[v5] = value
      newImgData.data[v5 + 1] = value
      newImgData.data[v5 + 2] = value
      newImgData.data[v5 + 3] = 255


    }
  }

  ooimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  oo23.width = ooimg.width
  oo23.height = ooimg.height
  oo.drawImage(ooimg, 0, 0, ooimg.width, ooimg.height)

}

//ORDENADO 3X3
const o3 = document.getElementById('o3')
const oo3 = document.getElementById('oo3')
const ooo = oo3.getContext('2d')
let oooimg = new Image

o3.onclick = function () {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  let pointSizeX = 3
  let pointSizeY = 3

  let matriz = [128, 32, 110, 223, 250, 132, 120, 24, 3]

  for (let y = 0; y < srcImage.height; y += pointSizeY) {
    for (let x = 0; x < srcImage.width; x += pointSizeX) {
      var v0 = getPixelIndex(x + 1, y)
      var v1 = getPixelIndex(x + 2, y)
      var v3 = getPixelIndex(x, y + 1)
      var v4 = getPixelIndex(x + 1, y + 1)
      var v5 = getPixelIndex(x + 2, y + 1)
      var v6 = getPixelIndex(x, y + 2)
      var v7 = getPixelIndex(x + 1, y + 2)
      var v8 = getPixelIndex(x + 2, y + 2)
      var pixel = getPixelIndex(x, y) //Pixel atual

      let averageColor = (imgData.data[pixel] + imgData.data[pixel + 1] + imgData.data[pixel + 2]) / 3

      let value = averageColor < matriz[0] ? 0 : 255
      newImgData.data[pixel] = value
      newImgData.data[pixel + 1] = value
      newImgData.data[pixel + 2] = value
      newImgData.data[pixel + 3] = 255

      averageColor = (imgData.data[v0] + imgData.data[v0 + 1] + imgData.data[v0 + 2]) / 3

      value = averageColor < matriz[1] ? 0 : 255
      newImgData.data[v0] = value
      newImgData.data[v0 + 1] = value
      newImgData.data[v0 + 2] = value
      newImgData.data[v0 + 3] = 255

      averageColor = (imgData.data[v1] + imgData.data[v1 + 1] + imgData.data[v1 + 2]) / 3

      value = averageColor < matriz[2] ? 0 : 255
      newImgData.data[v1] = value
      newImgData.data[v1 + 1] = value
      newImgData.data[v1 + 2] = value
      newImgData.data[v1 + 3] = 255

      averageColor = (imgData.data[v3] + imgData.data[v3 + 1] + imgData.data[v3 + 2]) / 3

      value = averageColor < matriz[3] ? 0 : 255
      newImgData.data[v3] = value
      newImgData.data[v3 + 1] = value
      newImgData.data[v3 + 2] = value
      newImgData.data[v3 + 3] = 255

      averageColor = (imgData.data[v3] + imgData.data[v3 + 1] + imgData.data[v3 + 2]) / 3

      value = averageColor < matriz[4] ? 0 : 255
      newImgData.data[v4] = value
      newImgData.data[v4 + 1] = value
      newImgData.data[v4 + 2] = value
      newImgData.data[v4 + 3] = 255

      averageColor = (imgData.data[v5] + imgData.data[v5 + 1] + imgData.data[v5 + 2]) / 3

      value = averageColor < matriz[5] ? 0 : 255
      newImgData.data[v5] = value
      newImgData.data[v5 + 1] = value
      newImgData.data[v5 + 2] = value
      newImgData.data[v5 + 3] = 255

      averageColor = (imgData.data[v6] + imgData.data[v6 + 1] + imgData.data[v6 + 2]) / 3

      value = averageColor < matriz[6] ? 0 : 255
      newImgData.data[v6] = value
      newImgData.data[v6 + 1] = value
      newImgData.data[v6 + 2] = value
      newImgData.data[v6 + 3] = 255

      averageColor = (imgData.data[v7] + imgData.data[v7 + 1] + imgData.data[v7 + 2]) / 3

      value = averageColor < matriz[7] ? 0 : 255
      newImgData.data[v7] = value
      newImgData.data[v7 + 1] = value
      newImgData.data[v7 + 2] = value
      newImgData.data[v7 + 3] = 255

      averageColor = (imgData.data[v8] + imgData.data[v8 + 1] + imgData.data[v8 + 2]) / 3

      value = averageColor < matriz[8] ? 0 : 255
      newImgData.data[v8] = value
      newImgData.data[v8 + 1] = value
      newImgData.data[v8 + 2] = value
      newImgData.data[v8 + 3] = 255


    }
  }

  oooimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  oo3.width = oooimg.width
  oo3.height = oooimg.height
  ooo.drawImage(oooimg, 0, 0, oooimg.width, oooimg.height)

}

//FLOYD E STEINBERG
const floyd = document.getElementById('floyd')
const ste = document.getElementById('ste')
const fs = ste.getContext('2d')
let fsmg = new Image

floyd.onclick = function () {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  const matriz = [
    [1, 0, 7 / 16],
    [-1, 1, 3 / 16],
    [0, 1, 5 / 16],
    [1, 1, 1 / 16]
  ];

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      var pixel = getPixelIndex(x, y) //Pixel atual

      let oldR = newImgData.data[pixel]
      let oldG = newImgData.data[pixel + 1]
      let oldB = newImgData.data[pixel + 2]

      let newR = (oldR < 128 ? 0 : 255)
      let newG = (oldG < 128 ? 0 : 255)
      let newB = (oldB < 128 ? 0 : 255)

      newImgData.data[pixel] = newR
      newImgData.data[pixel + 1] = newG
      newImgData.data[pixel + 2] = newB
      newImgData.data[pixel + 3] = 255

      let erroR = oldR - newR
      let erroG = oldG - newG
      let erroB = oldB - newB

      for (const [dx, dy, factor] of matriz) {
        const newX = x + dx;
        const newY = y + dy;

        if (newX >= 0 && newX < srcImage.width && newY >= 0 && newY < srcImage.height) {
          const newPixelOffset = getPixelIndex(newX, newY)

          newImgData.data[newPixelOffset] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset] + erroR * factor))
          newImgData.data[newPixelOffset + 1] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 1] + erroG * factor))
          newImgData.data[newPixelOffset + 2] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 2] + erroB * factor))
          newImgData.data[newPixelOffset + 3] = 255
        }
      }
    }
  }

  fsmg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  ste.width = fsmg.width
  ste.height = fsmg.height
  fs.drawImage(fsmg, 0, 0, fsmg.width, fsmg.height)

}

//ROGERS
const rogers = document.getElementById('rogers')
const roger = document.getElementById('roger')
const rog = roger.getContext('2d')
let rogimg = new Image

rogers.onclick = function () {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  const matriz = [
    [1, 0, 3 / 8],
    [0, 1, 3 / 8],
    [1, 1, 2 / 8]
  ];

  console.log(matriz)

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      var pixel = getPixelIndex(x, y) //Pixel atual

      let oldR = newImgData.data[pixel]
      let oldG = newImgData.data[pixel + 1]
      let oldB = newImgData.data[pixel + 2]

      let newR = (oldR < 128 ? 0 : 255)
      let newG = (oldG < 128 ? 0 : 255)
      let newB = (oldB < 128 ? 0 : 255)

      newImgData.data[pixel] = newR
      newImgData.data[pixel + 1] = newG
      newImgData.data[pixel + 2] = newB
      newImgData.data[pixel + 3] = 255

      let erroR = oldR - newR
      let erroG = oldG - newG
      let erroB = oldB - newB

      for (const [dx, dy, factor] of matriz) {
        const newX = x + dx
        const newY = y + dy

        if (newX >= 0 && newX < srcImage.width && newY >= 0 && newY < srcImage.height) {
          const newPixelOffset = getPixelIndex(newX, newY)

          newImgData.data[newPixelOffset] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset] + erroR * factor))
          newImgData.data[newPixelOffset + 1] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 1] + erroG * factor))
          newImgData.data[newPixelOffset + 2] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 2] + erroB * factor))
          newImgData.data[newPixelOffset + 3] = 255
        }
      }
    }
  }

  rogimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  roger.width = rogimg.width
  roger.height = rogimg.height
  rog.drawImage(rogimg, 0, 0, rogimg.width, rogimg.height)

}

//JARVIS, JUDICE & NINKE
const jjn = document.getElementById('jjn')
const jjnc = document.getElementById('jjnc')
const jj = jjnc.getContext('2d')
let jjimg = new Image

jjn.onclick = function () {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  const matriz = [
    [1, 0, 7 / 48],
    [2, 0, 5 / 48],
    [-2, 1, 3 / 48],
    [-1, 1, 5 / 48],
    [0, 1, 7 / 48],
    [1, 1, 5 / 48],
    [2, 1, 3 / 48],
    [-2, 2, 1 / 48],
    [-1, 2, 3 / 48],
    [0, 2, 5 / 48],
    [1, 2, 3 / 48],
    [2, 2, 1 / 48]
  ];

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      var pixel = getPixelIndex(x, y) //Pixel atual

      let oldR = newImgData.data[pixel]
      let oldG = newImgData.data[pixel + 1]
      let oldB = newImgData.data[pixel + 2]

      let newR = (oldR < 128 ? 0 : 255)
      let newG = (oldG < 128 ? 0 : 255)
      let newB = (oldB < 128 ? 0 : 255)

      newImgData.data[pixel] = newR
      newImgData.data[pixel + 1] = newG
      newImgData.data[pixel + 2] = newB

      let erroR = oldR - newR
      let erroG = oldG - newG
      let erroB = oldB - newB

      for (const [dx, dy, factor] of matriz) {
        const newX = x + dx;
        const newY = y + dy;

        if (newX > 0 && newX < srcImage.width && newY > 0 && newY < srcImage.height) {
          const newPixelOffset = getPixelIndex(newX, newY)

          newImgData.data[newPixelOffset] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset] + erroR * factor))
          newImgData.data[newPixelOffset + 1] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 1] + erroG * factor))
          newImgData.data[newPixelOffset + 2] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 2] + erroB * factor))
          newImgData.data[newPixelOffset + 3] = 255
        }
      }


    }
  }

  jjimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  jjnc.width = jjimg.width
  jjnc.height = jjimg.height
  jj.drawImage(jjimg, 0, 0, jjimg.width, jjimg.height)

}

//STUKI
const st = document.getElementById('st')
const stc = document.getElementById('stc')
const stt = stc.getContext('2d')
let stimg = new Image

st.onclick = function () {

  let newImgData = new ImageData(srcImage.width, srcImage.height)


  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  const matriz = [
    [1, 0, 8 / 42],
    [2, 0, 4 / 42],
    [-2, 1, 2 / 42],
    [-1, 1, 4 / 42],
    [0, 1, 8 / 42],
    [1, 1, 4 / 42],
    [2, 1, 2 / 42],
    [-2, 2, 1 / 42],
    [-1, 2, 2 / 42],
    [0, 2, 4 / 42],
    [1, 2, 2 / 42],
    [2, 2, 1 / 42]
  ];

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      var pixel = getPixelIndex(x, y) //Pixel atual

      let oldR = newImgData.data[pixel]
      let oldG = newImgData.data[pixel + 1]
      let oldB = newImgData.data[pixel + 2]

      let newR = (oldR < 128 ? 0 : 255)
      let newG = (oldG < 128 ? 0 : 255)
      let newB = (oldB < 128 ? 0 : 255)

      newImgData.data[pixel] = newR
      newImgData.data[pixel + 1] = newG
      newImgData.data[pixel + 2] = newB
      newImgData.data[pixel + 3] = 255

      let erroR = oldR - newR
      let erroG = oldG - newG
      let erroB = oldB - newB

      for (const [dx, dy, factor] of matriz) {
        const newX = x + dx;
        const newY = y + dy;

        if (newX >= 0 && newX < srcImage.width && newY >= 0 && newY < srcImage.height) {
          const newPixelOffset = getPixelIndex(newX, newY)

          newImgData.data[newPixelOffset] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset] + erroR * factor))
          newImgData.data[newPixelOffset + 1] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 1] + erroG * factor))
          newImgData.data[newPixelOffset + 2] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 2] + erroB * factor))
          newImgData.data[newPixelOffset + 3] = 255
        }
      }
    }
  }

  stimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  stc.width = stimg.width
  stc.height = stimg.height
  stt.drawImage(stimg, 0, 0, stimg.width, stimg.height)

}

//STEVENSON & ARCE
const sa = document.getElementById('sa')
const sac = document.getElementById('sac')
const saa = sac.getContext('2d')
let saimg = new Image

sa.onclick = function () {

  let newImgData = new ImageData(srcImage.width, srcImage.height)


  for (let i = 0; i < newImgData.data.length; i++) {
    newImgData.data[i] = imgData.data[i]
  }

  const matriz = [
    [2, 0, 32 / 200],
    [-3, 1, 12 / 200],
    [-1, 1, 26 / 200],
    [1, 1, 30 / 200],
    [3, 1, 16 / 200],
    [-2, 2, 12 / 200],
    [0, 2, 26 / 200],
    [2, 2, 12 / 200],
    [-3, 3, 5 / 200],
    [-1, 3, 12 / 200],
    [1, 3, 12 / 200],
    [3, 3, 5 / 200]
  ];

  for (let y = 0; y < srcImage.height; y++) {
    for (let x = 0; x < srcImage.width; x++) {
      var pixel = getPixelIndex(x, y) //Pixel atual

      let oldR = newImgData.data[pixel]
      let oldG = newImgData.data[pixel + 1]
      let oldB = newImgData.data[pixel + 2]

      let newR = (oldR < 128 ? 0 : 255)
      let newG = (oldG < 128 ? 0 : 255)
      let newB = (oldB < 128 ? 0 : 255)

      newImgData.data[pixel] = newR
      newImgData.data[pixel + 1] = newG
      newImgData.data[pixel + 2] = newB
      newImgData.data[pixel + 3] = 255

      let erroR = oldR - newR
      let erroG = oldG - newG
      let erroB = oldB - newB

      for (const [dx, dy, factor] of matriz) {
        const newX = x + dx;
        const newY = y + dy;

        if (newX >= 0 && newX < srcImage.width && newY >= 0 && newY < srcImage.height) {
          const newPixelOffset = getPixelIndex(newX, newY)

          newImgData.data[newPixelOffset] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset] + erroR * factor))
          newImgData.data[newPixelOffset + 1] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 1] + erroG * factor))
          newImgData.data[newPixelOffset + 2] = Math.min(255, Math.max(0, newImgData.data[newPixelOffset + 2] + erroB * factor))
          newImgData.data[newPixelOffset + 3] = 255
        }
      }
    }
  }

  saimg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  sac.width = saimg.width
  sac.height = saimg.height
  saa.drawImage(saimg, 0, 0, saimg.width, saimg.height)

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