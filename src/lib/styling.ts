export function getIgClass(modalFullscreen: boolean, additionalClass: string, currentlyUsingMouseOrKeyboard: string): string {
  let classes = ['image-gallery'];
  
  if (modalFullscreen) {
    classes.push('fullscreen-modal');
  }
  
  if (additionalClass) {
    classes.push(additionalClass);
  }
  
  if (currentlyUsingMouseOrKeyboard === 'mouse') {
    classes.push('image-gallery-using-mouse');
  }
  
  return classes.join(' ');
}

export function getIgContentClass(isFullscreen: boolean, thumbnailPosition: string): string {
  let classes = ['image-gallery-content'];
  
  if (isFullscreen) {
    classes.push('fullscreen');
  }
  
  if (thumbnailPosition === 'left') {
    classes.push('image-gallery-thumbnails-left');
  } else if (thumbnailPosition === 'right') {
    classes.push('image-gallery-thumbnails-right');
  }
  
  return classes.join(' ');
}

export function getSlideWrapperClass(isRTL: boolean, thumbnailPosition: string): string {
  let classes = ['image-gallery-slide-wrapper'];
  
  if (isRTL) {
    classes.push('image-gallery-rtl');
  }
  
  if (thumbnailPosition === 'left') {
    classes.push('image-gallery-thumbnails-left');
  } else if (thumbnailPosition === 'right') {
    classes.push('image-gallery-thumbnails-right');
  }
  
  return classes.join(' ');
}

export function getAlignmentClassName(index: number, currentIndex: number, infinite: boolean, totalSlides: number): string {
  if (index === currentIndex) {
    return 'image-gallery-center';
  }
  
  if (infinite) {
    if (index === currentIndex - 1 || (currentIndex === 0 && index === totalSlides - 1)) {
      return 'image-gallery-left';
    }
    if (index === currentIndex + 1 || (currentIndex === totalSlides - 1 && index === 0)) {
      return 'image-gallery-right';
    }
  } else {
    if (index === currentIndex - 1) {
      return 'image-gallery-left';
    }
    if (index === currentIndex + 1) {
      return 'image-gallery-right';
    }
  }
  
  return 'image-gallery-left';
}

export function getSlideStyle(
  index: number,
  currentIndex: number,
  previousIndex: number,
  totalSlides: number,
  isRTL: boolean,
  currentSlideOffset: number,
  infinite: boolean,
  isSlideVisible: boolean,
  transitionStyle: string,
  useTranslate3D: boolean
): string {
  if (!isSlideVisible) {
    return 'display: none;';
  }
  
  let translateX = 0;
  let translateY = 0;
  
  if (index === currentIndex) {
    translateX = currentSlideOffset;
  } else if (index === currentIndex - 1) {
    translateX = -100 + currentSlideOffset;
  } else if (index === currentIndex + 1) {
    translateX = 100 + currentSlideOffset;
  } else {
    return 'display: none;';
  }
  
  if (isRTL) {
    translateX = -translateX;
  }
  
  const transform = useTranslate3D 
    ? `translate3d(${translateX}%, ${translateY}%, 0)`
    : `translate(${translateX}%, ${translateY}%)`;
  
  return `transform: ${transform}; transition: ${transitionStyle};`;
}

export function getBulletStyle(index: number, currentIndex: number, bulletClass?: string): string {
  let classes = ['image-gallery-bullet'];
  
  if (index === currentIndex) {
    classes.push('active');
  }
  
  if (bulletClass) {
    classes.push(bulletClass);
  }
  
  return classes.join(' ');
}

export function getIgThumbnailClass(index: number, currentIndex: number, thumbnailClass?: string): string {
  let classes = ['image-gallery-thumbnail'];
  
  if (index === currentIndex) {
    classes.push('active');
  }
  
  if (thumbnailClass) {
    classes.push(thumbnailClass);
  }
  
  return classes.join(' ');
}

export function getThumbnailStyle(
  isRTL: boolean,
  thumbsTranslate: number,
  isThumbnailVertical: boolean,
  useTranslate3D: boolean,
  thumbsStyle: string
): string {
  const translate = isThumbnailVertical 
    ? useTranslate3D ? `translate3d(0, ${thumbsTranslate}px, 0)` : `translate(0, ${thumbsTranslate}px)`
    : useTranslate3D ? `translate3d(${thumbsTranslate}px, 0, 0)` : `translate(${thumbsTranslate}px, 0)`;
  
  return `transform: ${translate}; ${thumbsStyle}`;
}

export function getThumbsTranslate(
  thumbnails: HTMLElement,
  currentIndex: number,
  disableThumbnailScroll: boolean,
  thumbnailsWrapperWidth: number,
  thumbnailsWrapperHeight: number,
  isThumbnailVertical: boolean,
  totalSlides: number
): number {
  if (!thumbnails || disableThumbnailScroll) {
    return 0;
  }
  
  const thumbnailWidth = thumbnailsWrapperWidth / totalSlides;
  const thumbnailHeight = thumbnailsWrapperHeight / totalSlides;
  
  if (isThumbnailVertical) {
    return -currentIndex * thumbnailHeight;
  } else {
    return -currentIndex * thumbnailWidth;
  }
}

