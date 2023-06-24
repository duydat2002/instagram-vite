import type { ISize } from '@/types'

export function getImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      resolve(img)
    }
  })
}

export function getReviewImageSize(realImageSize: ISize, cropperSize: ISize) {
  const reviewSize = { width: 0, height: 0 }
  if (
    realImageSize.width < realImageSize.height ||
    (realImageSize.width >= realImageSize.height && cropperSize.width > cropperSize.height)
  ) {
    reviewSize.width = cropperSize.width
    reviewSize.height = (cropperSize.width * realImageSize.height) / realImageSize.width
  } else {
    reviewSize.height = cropperSize.height
    reviewSize.width = (cropperSize.height * realImageSize.width) / realImageSize.height
  }
  return reviewSize
}

export function getRatioCrop(realImageSize: ISize, cropperSize: ISize, scale: number) {
  let ratioCrop

  if (realImageSize.width > realImageSize.height) {
    ratioCrop = realImageSize.height / (cropperSize.height * scale)
  } else if (realImageSize.width < realImageSize.height) {
    ratioCrop = realImageSize.width / (cropperSize.width * scale)
  } else {
    if (cropperSize.width < cropperSize.height) {
      ratioCrop = realImageSize.height / (cropperSize.height * scale)
    } else {
      ratioCrop = realImageSize.width / (cropperSize.width * scale)
    }
  }

  return ratioCrop
}

export function drawInitCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  cropperSize: ISize
) {
  const reviewImageSize = {
    ...getReviewImageSize(img, cropperSize)
  }
  const ratioCrop = getRatioCrop(img, cropperSize, 1)

  canvas.width = cropperSize.width * ratioCrop
  canvas.height = cropperSize.height * ratioCrop

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  ctx.translate(
    -((reviewImageSize.width - cropperSize.width) / 2) * ratioCrop,
    -((reviewImageSize.height - cropperSize.height) / 2) * ratioCrop
  )

  ctx?.drawImage(img, 0, 0)

  return canvas
}
